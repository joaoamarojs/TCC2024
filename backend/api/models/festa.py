from django.db import models


class Festa(models.Model):
    nome = models.CharField(max_length=100)
    data_inicio = models.DateField()
    fechada = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
