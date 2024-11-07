from django.test import TestCase
from django.contrib.auth.models import User
from .models.barraca_festa import Barraca_Festa
from .models.barraca import Barraca
from .models.caixa_festa import Caixa_Festa
from .models.cartao import Cartao
from .models.cliente import Cliente
from .models.estoque import Estoque
from .models.festa import Festa
from .models.movimentacao_barraca import Movimentacao_Barraca
from .models.movimentacao_caixa import Movimentacao_Caixa
from .models.movimentacao_produto import Movimentacao_Produto
from .models.produto import Produto
from .models.produto_festa import Produto_Festa
from .models.tipo_produto import Tipo_produto


class BarracaFestaTestCase(TestCase):
    def setUp(self):
        # Criação de instâncias de Barraca, Festa, User para o teste
        self.user = User.objects.create(username="user_teste")
        self.barraca = Barraca.objects.create(nome="Barraca Teste", ativo=True)
        self.festa = Festa.objects.create(nome="Festa Teste", data_inicio="2023-10-10", fechada=False)
        self.barraca_festa = Barraca_Festa.objects.create(barraca=self.barraca, festa=self.festa, user_responsavel=self.user)

    def test_barraca_festa_creation(self):
        # Testa se a instância de Barraca_Festa foi criada corretamente
        self.assertEqual(self.barraca_festa.barraca, self.barraca)
        self.assertEqual(self.barraca_festa.festa, self.festa)
        self.assertEqual(self.barraca_festa.user_responsavel, self.user)

class CaixaFestaTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="user_teste_caixa")
        self.festa = Festa.objects.create(nome="Festa Caixa", data_inicio="2023-10-11", fechada=False)
        self.caixa_festa = Caixa_Festa.objects.create(
            festa=self.festa, troco_inicial=100.00, troco_final=0.00,
            iniciado=True, finalizado=False, user_caixa=self.user
        )

    def test_caixa_festa_creation(self):
        # Testa se a instância de Caixa_Festa foi criada corretamente
        self.assertEqual(self.caixa_festa.festa, self.festa)
        self.assertEqual(self.caixa_festa.troco_inicial, 100.00)
        self.assertEqual(self.caixa_festa.iniciado, True)
        self.assertEqual(self.caixa_festa.user_caixa, self.user)

class ClienteCartaoTestCase(TestCase):
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome="Cliente Teste", data_nascimento="2000-01-01",
            cpf="123.456.789-00", ativo=True
        )
        self.cartao = Cartao.objects.create(cliente=self.cliente, ativo=True)

    def test_cliente_cartao_creation(self):
        # Testa se Cliente e Cartão foram criados corretamente
        self.assertEqual(self.cartao.cliente, self.cliente)
        self.assertTrue(self.cartao.ativo)
        self.assertEqual(self.cliente.cpf, "123.456.789-00")

class EstoqueTestCase(TestCase):
    def setUp(self):
        self.produto = Produto.objects.create(
            nome="Produto Teste", barraca=None,
            tipo_produto=None, estocavel=True
        )
        self.festa = Festa.objects.create(nome="Festa Estoque", data_inicio="2023-10-12", fechada=False)
        self.estoque = Estoque.objects.create(produto=self.produto, quant=10, data="2023-10-12", festa=self.festa)

    def test_estoque_creation(self):
        # Testa se Estoque foi criado corretamente
        self.assertEqual(self.estoque.produto, self.produto)
        self.assertEqual(self.estoque.festa, self.festa)
        self.assertEqual(self.estoque.quant, 10)

class MovimentacaoBarracaTestCase(TestCase):
    def setUp(self):
        cliente = Cliente.objects.create(
            nome="Cliente Teste", data_nascimento="2000-01-01",
            cpf="123.456.789-00", ativo=True
        )
        self.user = User.objects.create(username="user_teste_mov_barraca")
        self.cartao = Cartao.objects.create(cliente=cliente, ativo=True)
        self.festa = Festa.objects.create(nome="Festa Movimentação", data_inicio="2023-10-13", fechada=False)
        self.barraca = Barraca.objects.create(nome="Barraca Movimentação", ativo=True)
        self.movimentacao_barraca = Movimentacao_Barraca.objects.create(
            desc="Venda de Produto", cartao=self.cartao, festa=self.festa,
            valor=150.00, user_barraca=self.user, barraca=self.barraca
        )

    def test_movimentacao_barraca_creation(self):
        # Testa se a Movimentação Barraca foi criada corretamente
        self.assertEqual(self.movimentacao_barraca.desc, "Venda de Produto")
        self.assertEqual(self.movimentacao_barraca.valor, 150.00)
        self.assertEqual(self.movimentacao_barraca.barraca, self.barraca)

class MovimentacaoCaixaTestCase(TestCase):
    def setUp(self):
        cliente = Cliente.objects.create(
            nome="Cliente Teste", data_nascimento="2000-01-01",
            cpf="123.456.789-00", ativo=True
        )
        self.user = User.objects.create(username="user_teste_mov_caixa")
        self.cartao = Cartao.objects.create(cliente=cliente, ativo=True)
        self.festa = Festa.objects.create(nome="Festa Caixa Movimentação", data_inicio="2023-10-14", fechada=False)
        self.movimentacao_caixa = Movimentacao_Caixa.objects.create(
            desc="Pagamento com Cartão", forma_pagamento="Cartão", cartao=self.cartao,
            festa=self.festa, valor=200.00, user_caixa=self.user
        )

    def test_movimentacao_caixa_creation(self):
        # Testa se a Movimentação Caixa foi criada corretamente
        self.assertEqual(self.movimentacao_caixa.desc, "Pagamento com Cartão")
        self.assertEqual(self.movimentacao_caixa.forma_pagamento, "Cartão")
        self.assertEqual(self.movimentacao_caixa.valor, 200.00)
        self.assertEqual(self.movimentacao_caixa.festa, self.festa)


class MovimentacaoProdutoTestCase(TestCase):
    def setUp(self):
        tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.barraca = Barraca.objects.create(nome="Barraca Produto", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste Movimentação", barraca=self.barraca, tipo_produto=tipo_produto, estocavel=True
        )
        cliente = Cliente.objects.create(
            nome="Cliente Teste", data_nascimento="2000-01-01",
            cpf="123.456.789-00", ativo=True
        )
        self.cartao = Cartao.objects.create(cliente=cliente, ativo=True)
        self.user_barraca = User.objects.create(username="user_teste_mov_barraca")
        self.festa = Festa.objects.create(nome="Festa Movimentação", data_inicio="2023-10-13", fechada=False)
        self.movimentacao_barraca = Movimentacao_Barraca.objects.create(
            desc="Venda com Movimentação Produto", cartao=self.cartao, festa=self.festa,
            valor=150.00, user_barraca=self.user_barraca, barraca=self.barraca
        )
        self.movimentacao_produto = Movimentacao_Produto.objects.create(
            movimentacao=self.movimentacao_barraca, produto=self.produto, qtd=5
        )

    def test_movimentacao_produto_creation(self):
        # Testa se Movimentação Produto foi criada corretamente
        self.assertEqual(self.movimentacao_produto.movimentacao, self.movimentacao_barraca)
        self.assertEqual(self.movimentacao_produto.produto, self.produto)
        self.assertEqual(self.movimentacao_produto.qtd, 5)


class ProdutoFestaTestCase(TestCase):
    def setUp(self):
        tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.barraca = Barraca.objects.create(nome="Barraca Produto", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste Festa", barraca=self.barraca, tipo_produto=tipo_produto, estocavel=True
        )
        self.festa = Festa.objects.create(nome="Festa Produto", data_inicio="2023-10-15", fechada=False)
        self.produto_festa = Produto_Festa.objects.create(produto=self.produto, festa=self.festa, valor=50.00)

    def test_produto_festa_creation(self):
        # Testa se Produto na Festa foi criado corretamente
        self.assertEqual(self.produto_festa.produto, self.produto)
        self.assertEqual(self.produto_festa.festa, self.festa)
        self.assertEqual(self.produto_festa.valor, 50.00)


class ProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.barraca = Barraca.objects.create(nome="Barraca Produto", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste", barraca=self.barraca, tipo_produto=self.tipo_produto, estocavel=True
        )

    def test_produto_creation(self):
        # Testa se o Produto foi criado corretamente
        self.assertEqual(self.produto.nome, "Produto Teste")
        self.assertEqual(self.produto.barraca, self.barraca)
        self.assertEqual(self.produto.tipo_produto, self.tipo_produto)
        self.assertTrue(self.produto.estocavel)


class TipoProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Produto Teste")

    def test_tipo_produto_creation(self):
        # Testa se o Tipo de Produto foi criado corretamente
        self.assertEqual(self.tipo_produto.nome, "Tipo Produto Teste")

class FestaTestCase(TestCase):
    def setUp(self):
        self.festa = Festa.objects.create(nome="Festa de Teste", data_inicio="2023-10-20", fechada=False)

    def test_festa_creation(self):
        # Testa se a festa foi criada corretamente
        self.assertEqual(self.festa.nome, "Festa de Teste")
        self.assertEqual(self.festa.data_inicio, "2023-10-20")
        self.assertFalse(self.festa.fechada)

    def test_festa_close(self):
        # Testa a mudança do estado de "fechada" na festa
        self.festa.fechada = True
        self.festa.save()
        self.assertTrue(self.festa.fechada)


class CartaoTestCase(TestCase):
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome="Cliente Cartao", data_nascimento="2000-01-01",
            cpf="987.654.321-00", ativo=True
        )
        self.cartao = Cartao.objects.create(cliente=self.cliente, ativo=True)

    def test_cartao_creation(self):
        # Testa se o cartão foi criado corretamente e está ativo
        self.assertEqual(self.cartao.cliente, self.cliente)
        self.assertTrue(self.cartao.ativo)

    def test_deactivate_cartao(self):
        # Testa a desativação do cartão
        self.cartao.ativo = False
        self.cartao.save()
        self.assertFalse(self.cartao.ativo)


class ClienteTestCase(TestCase):
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome="Cliente Teste", data_nascimento="1995-05-05",
            cpf="123.456.789-00", ativo=True
        )

    def test_cliente_creation(self):
        # Testa se o cliente foi criado corretamente
        self.assertEqual(self.cliente.nome, "Cliente Teste")
        self.assertEqual(self.cliente.cpf, "123.456.789-00")
        self.assertTrue(self.cliente.ativo)

    def test_activate_cliente(self):
        # Testa a ativação do cliente
        self.cliente.ativo = True
        self.cliente.save()
        self.assertTrue(self.cliente.ativo)


class EstoqueTestCase(TestCase):
    def setUp(self):
        tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        barraca = Barraca.objects.create(nome="Barraca Produto", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste Estoque", barraca=barraca,
            tipo_produto=tipo_produto, estocavel=True
        )
        self.festa = Festa.objects.create(nome="Festa para Estoque", data_inicio="2023-10-21", fechada=False)
        self.estoque = Estoque.objects.create(produto=self.produto, quant=100, data="2023-10-21", festa=self.festa)

    def test_estoque_creation(self):
        # Testa se o estoque foi criado corretamente
        self.assertEqual(self.estoque.produto, self.produto)
        self.assertEqual(self.estoque.quant, 100)
        self.assertEqual(self.estoque.festa, self.festa)

    def test_update_estoque_quantity(self):
        # Testa a atualização da quantidade no estoque
        self.estoque.quant += 50
        self.estoque.save()
        self.assertEqual(self.estoque.quant, 150)