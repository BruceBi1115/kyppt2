from django.contrib.auth.models import AbstractUser
from django.db import models


class Entity(models.Model):
    entity_name = models.CharField(max_length=500)
    aliases = models.TextField(blank=True, null=True)
    date_of_listing = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50)
    reason_for_listing = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=255)
    location_1 = models.TextField(blank=True, null=True)
    location_2 = models.TextField(blank=True, null=True)
    location_3 = models.TextField(blank=True, null=True)
    location_4 = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'entity'
        verbose_name = 'Entity'
        verbose_name_plural = 'Entities'

    def __str__(self):
        return self.entity_name


class Individual(models.Model):
    individual_name = models.CharField(max_length=255)
    aliases = models.TextField(blank=True, null=True)
    date_of_listing = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50)
    reason_for_listing = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=255)
    location_1 = models.TextField(blank=True, null=True)
    location_2 = models.TextField(blank=True, null=True)
    location_3 = models.TextField(blank=True, null=True)
    location_4 = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'individual'
        verbose_name = 'Individual'
        verbose_name_plural = 'Individuals'

    def __str__(self):
        return self.individual_name


class Location(models.Model):
    country = models.CharField(max_length=100)
    kypp_decision = models.CharField(max_length=50)
    sanctioned_regime = models.CharField(max_length=3)

    class Meta:
        db_table = 'location'
        verbose_name = 'Location'
        verbose_name_plural = 'Locations'

    def __str__(self):
        return self.country
