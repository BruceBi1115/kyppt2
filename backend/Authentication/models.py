from django.contrib.auth.models import AbstractUser
from django.db import models


class UserProfile(AbstractUser):
    USER_ROLE = 'user'
    ADMIN_ROLE = 'admin'
    ROLE_CHOICES = [
        (USER_ROLE, 'User'),
        (ADMIN_ROLE, 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER_ROLE)

    class Meta:
        db_table = 'user_profile'
        verbose_name = 'UserProfile'

    def __str__(self):
        return self.email

    # Explicitly define groups and user_permissions with unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name="userprofile_groups",
        related_query_name="userprofile",
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name="userprofile_user_permissions",
        related_query_name="userprofile",
    )



