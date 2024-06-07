from django.test import TestCase
from .models.barraca import Barraca
from .models.cliente import Cliente
from .models.colaborador import Colaborador
from .models.produto import Produto
from .models.tipo_produto import Tipo_produto
from django.core.exceptions import ValidationError


class BarracaTestCase(TestCase):
    def setUp(self):
        self.barraca = Barraca.objects.create(nome="Barraca Teste", ativo=True)

    def test_barraca_criacao(self):
        self.assertEqual(self.barraca.nome, "Barraca Teste")
        self.assertTrue(self.barraca.ativo)

    def test_barraca_str(self):
        self.assertEqual(str(self.barraca), "Barraca Teste")


class ProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.barraca = Barraca.objects.create(nome="Barraca Teste", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste",
            barraca=self.barraca,
            tipo_produto=self.tipo_produto
        )

    def test_produto_criacao(self):
        self.assertEqual(self.produto.nome, "Produto Teste")
        self.assertEqual(self.produto.barraca, self.barraca)
        self.assertEqual(self.produto.tipo_produto, self.tipo_produto)

    def test_produto_str(self):
        self.assertEqual(str(self.produto), "Produto Teste")


class TipoProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")

    def test_tipo_produto_criacao(self):
        self.assertEqual(self.tipo_produto.nome, "Tipo Teste")

    def test_tipo_produto_str(self):
        self.assertEqual(str(self.tipo_produto), "Tipo Teste")


class BarracaProntaComProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.barraca = Barraca.objects.create(nome="Barraca Teste", ativo=True)
        self.produto = Produto.objects.create(
            nome="Produto Teste",
            barraca=self.barraca,
            tipo_produto=self.tipo_produto
        )

    def test_criar_barraca(self):
        self.assertEqual(self.produto.nome, "Produto Teste")
        self.assertEqual(self.produto.barraca.nome, "Barraca Teste")
        self.assertEqual(self.produto.tipo_produto.nome, "Tipo Teste")

        self.assertEqual(str(self.tipo_produto), "Tipo Teste")
        self.assertEqual(str(self.barraca), "Barraca Teste")
        self.assertEqual(str(self.produto), "Produto Teste")       


class BarracaProntaComDoisProdutoTestCase(TestCase):
    def setUp(self):
        self.tipo_produto = Tipo_produto.objects.create(nome="Tipo Teste")
        self.tipo_produto2 = Tipo_produto.objects.create(nome="Tipo Teste2")
        self.barraca = Barraca.objects.create(nome="Barraca Teste", ativo=True)
        self.produto = Produto.objects.create(nome="Produto Teste",barraca=self.barraca,tipo_produto=self.tipo_produto)
        self.produto2 = Produto.objects.create(nome="Produto Teste2",barraca=self.barraca,tipo_produto=self.tipo_produto2)

    def test_criar_barraca(self):
        self.assertEqual(self.produto.nome, "Produto Teste")
        self.assertEqual(self.produto2.nome, "Produto Teste2")
        self.assertEqual(self.produto.barraca.nome, "Barraca Teste")
        self.assertEqual(self.produto.tipo_produto.nome, "Tipo Teste")
        self.assertEqual(self.produto2.tipo_produto.nome, "Tipo Teste2")

        self.assertEqual(str(self.tipo_produto), "Tipo Teste")
        self.assertEqual(str(self.tipo_produto2), "Tipo Teste2")
        self.assertEqual(str(self.barraca), "Barraca Teste")
        self.assertEqual(str(self.produto), "Produto Teste")     
        self.assertEqual(str(self.produto2), "Produto Teste2")           


class ColaboradorTestCase(TestCase):
    def setUp(self):
        self.cpf_valido = "" #Coloque um cpf valido
        self.cpf_invalido = "123.456.789-00"  

    def test_colaborador_criacao(self):
        colaborador = Colaborador.objects.create(nome="Colaborador Teste",data_nascimento="2000-01-01",cpf=self.cpf_valido,ativo=True)
        self.assertEqual(colaborador.nome, "Colaborador Teste")
        self.assertEqual(colaborador.cpf, self.cpf_valido)

    def test_colaborador_cpf_invalido(self):
        with self.assertRaises(ValidationError):
            colaborador = Colaborador(nome="Colaborador Teste",data_nascimento="2000-01-01",cpf=self.cpf_invalido,ativo=True)
            colaborador.full_clean()        


class ClienteTestCase(TestCase):
    def setUp(self):
        self.cpf_valido = ""  #Coloque um cpf valido
        self.cpf_invalido = "123.456.789-00" 

    def test_cliente_criacao(self):
        cliente = Cliente.objects.create(nome="Cliente Teste",data_nascimento="2000-01-01",cpf=self.cpf_valido,ativo=True)
        self.assertEqual(cliente.nome, "Cliente Teste")
        self.assertEqual(cliente.cpf, self.cpf_valido)

    def test_cliente_cpf_invalido(self):
        with self.assertRaises(ValidationError):
            cliente = Cliente(nome="Cliente Teste",data_nascimento="2000-01-01",cpf=self.cpf_invalido,ativo=True)
            cliente.full_clean()        