
from django.urls import path
from .views import upload_and_process, get_upload_progress

urlpatterns = [
    path('api/upload_and_process', upload_and_process, name='upload_and_process'),
    path('api/upload_progress/', get_upload_progress, name='upload_progress'),
]


