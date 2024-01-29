from django.contrib import admin
from django.urls import path, include ,re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication
from Database.views import search

class UnauthenticatedSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        """
        Return `None` if the request does not have an authenticated user.
        This allows the view to be accessed without authentication or authorization.
        """
        return self.enforce_csrf(request)

schema_view = get_schema_view(
    openapi.Info(
        title="KnowYourPartner",
        default_version='v1',
        description="API documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=(UnauthenticatedSessionAuthentication,),
)


urlpatterns = [

    path('auth/', include('Authentication.urls')),
    path('api/search', search, name='api-search'),
    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('database/', include('Database.urls')),
]


