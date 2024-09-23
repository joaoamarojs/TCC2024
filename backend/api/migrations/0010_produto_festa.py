# Generated by Django 5.1 on 2024-08-31 00:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_produto_estocavel'),
    ]

    operations = [
        migrations.CreateModel(
            name='Produto_Festa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('festa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='produtos_na_festa', to='api.festa')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='produto_na_festa', to='api.produto')),
            ],
            options={
                'unique_together': {('produto', 'festa')},
            },
        ),
    ]