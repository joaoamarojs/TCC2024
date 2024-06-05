from django.db import models


class Tipo_produto(models.Model):
    nome = models.CharField(max_length=100)
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome
