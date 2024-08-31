from django.db import IntegrityError, models
from django.core.exceptions import ValidationError
from .festa import Festa
from .produto import Produto
from .barraca_festa import Barraca_Festa

class Produto_Festa(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.RESTRICT, related_name="produto_na_festa")
    festa = models.ForeignKey(Festa, on_delete=models.CASCADE, related_name="produtos_na_festa")
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.produto.nome