from django.db import models
from django.contrib.auth.models import User
from .festa import Festa
from .cartao import Cartao
from .barraca import Barraca


class Movimentacao_Barraca(models.Model):
    desc = models.CharField(max_length=150)
    cartao = models.ForeignKey(Cartao, on_delete=models.RESTRICT, related_name="movimentacoes_barraca")
    festa = models.ForeignKey(Festa, on_delete=models.RESTRICT, related_name="movimentacoes_barraca")
    valor = models.DecimalField(decimal_places=2,max_digits=10)
    user_barraca = models.ForeignKey(User, on_delete=models.RESTRICT, related_name="movimentacoes_barraca")
    barraca = models.ForeignKey(Barraca, on_delete=models.RESTRICT, related_name="movimentacoes_barraca")

    def __str__(self):
        return self.user_barraca
