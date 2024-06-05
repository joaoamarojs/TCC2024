from django.db import models
from django.contrib.auth.models import User


class Colaborador(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    ativo = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
