# Generated by Django 3.1.12 on 2024-12-04 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_id', models.CharField(max_length=100, unique=True)),
                ('test_content', models.TextField()),
                ('user_id', models.CharField(max_length=100)),
            ],
        ),
    ]