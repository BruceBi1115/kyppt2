from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from .swagger_schema import SwaggerLoginSchema
from .models import UserProfile
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'list', 'retrieve']:
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh-token': str(refresh),
                'access-token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['login']:
            self.permission_classes = [AllowAny, ]
        elif self.action in ['logout']:
            self.permission_classes = [IsAuthenticated, ]
        return super().get_permissions()

    @swagger_auto_schema(method='post', request_body=SwaggerLoginSchema.login_schema,
                         responses=SwaggerLoginSchema.login_schema_response)
    @action(detail=False, methods=['post'], url_name='login')
    def login(self, request):
        user_email = request.data.get('email')
        password = request.data.get('password')

        user = UserProfile.objects.filter(email=user_email).first()
        if user and user.check_password(password):
            token = RefreshToken.for_user(user=user)
            return Response({
                'refresh': str(token),
                'access': str(token.access_token),
                'email': user_email,
                'id': user.id
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @swagger_auto_schema(method='post', request_body=SwaggerLoginSchema.logout_schema,
                         responses=SwaggerLoginSchema.logout_schema_response)
    @action(detail=False, methods=['post'], url_name='logout')
    def logout(self, request):
        refresh_token = request.data.get('refresh_token')
        print(refresh_token)
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
                return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'message': 'Invalid token or token has already expired'},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Refresh token is required'}, status=status.HTTP_401_UNAUTHORIZED)
