# Generated by Django 4.2.8 on 2024-01-09 03:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Database', '0003_rename_entity_entity_entity_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entity',
            name='date_of_listing',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='individual',
            name='date_of_listing',
            field=models.TextField(blank=True, null=True),
        ),
    ]
