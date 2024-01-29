from drf_yasg import openapi
from rest_framework import status

class SwaggerLoginSchema:
    login_schema = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email address'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
        },
        required=['email', 'password']
    )
    login_schema_response = {
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token for authentication'),
                'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token for authentication')
            }
        ),
    }

    logout_schema = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh_token': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token to be invalidated'),
        },
        required=['refresh_token']
    )
    logout_schema_response = {
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Logout success message')
            }
        )
    }
