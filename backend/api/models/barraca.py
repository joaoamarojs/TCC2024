from django.db import models


class Barraca(models.Model):
    nome = models.CharField(max_length=100)
    dataCriacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
    

    