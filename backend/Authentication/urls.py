from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AuthViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='auth-login'),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='auth-logout'),
]


