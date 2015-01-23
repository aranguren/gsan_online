var app = angular.module("gsan");

app.controller("ClientesNewController", ["EnderecoTipo", "EnderecoReferencia", "Municipio", "EsferaPoder", "RamoAtividade", "PessoaSexo", "Profissao", "OrgaoExpedidorRg", "UnidadeFederacao", "ClienteTipo", "Cliente", "CadastroUrl", "$scope", "$http", "$location", "Flash", "$filter",
                                 function(EnderecoTipo, EnderecoReferencia, Municipio, EsferaPoder, RamoAtividade, PessoaSexo, Profissao, OrgaoExpedidorRg, UnidadeFederacao, ClienteTipo, Cliente, CadastroUrl, $scope, $http, $location, Flash, $filter) {

  $scope.cliente = { ativo: 1, gera_fatura_antecipada: 2, permite_negativacao: 2, enderecos: [] };

  $scope.profissoes           = Profissao.query();
  $scope.clienteTipos         = ClienteTipo.query();
  $scope.unidadeFederacoes    = UnidadeFederacao.query();
  $scope.orgaosExpedidoresRg  = OrgaoExpedidorRg.query();
  $scope.pessoaSexos          = PessoaSexo.query();
  $scope.ramosAtividades      = RamoAtividade.query();
  $scope.esferasPoder         = EsferaPoder.query();
  $scope.municipios           = Municipio.query();
  $scope.endereco_referencias = EnderecoReferencia.query();
  $scope.enderecoTipos        = EnderecoTipo.query();

  $scope.cliente_responsavel_superior = {};
  $scope.endereco = {};
  $scope.pesquisarNovoResponsavelSuperior = false;
  $scope.adicionandoNovoEndereco = false;

  $scope.mostrarPesquisaNovoResponsavelSuperior = function(mostrar) {
    $scope.pesquisarNovoResponsavelSuperior = mostrar;
  };

  $scope.mostrarAdicionarNovoEndereco = function(mostrar) {
    $scope.adicionandoNovoEndereco = mostrar;
  };

  $scope.adicionarEndereco = function() {
    $scope.cliente.enderecos.push($scope.endereco);
    $scope.mostrarAdicionarNovoEndereco(false);
    $scope.endereco = {};
  };

  $scope.removerEndereco = function(endereco) {
    var index = $scope.cliente.enderecos.indexOf(endereco);
    $scope.cliente.enderecos.splice(index, 1);
  }

  $scope.pesquisarClienteResponsavel = function() {
    var copiedQuery = jQuery.extend({}, $scope.cliente_responsavel_superior);
    $scope.clienteResponsavelQueryCache = { query: copiedQuery };
    $scope.submeterPesquisaClienteResponsavel();
  };

  $scope.submeterPesquisaClienteResponsavel = function() {
    var query = $.param($scope.clienteResponsavelQueryCache);
    $scope.loadingClientesResponsaveis = true;
    $http.get(CadastroUrl() + "/clientes?" + query)
    .success(function(data) {
      $scope.responsaveisSuperiores = data.clientes;
      $scope.clienteResponsabelPage = data.page;
      $scope.loadingClientesResponsaveis = false;
    }).error(function() {
      $scope.loadingClientesResponsaveis = false;
    });
  };

  $scope.selecionarResponsavelSuperior = function(responsavelSuperior) {
    $scope.responsaveisSuperiores = [];
    $scope.cliente.responsavelSuperior = responsavelSuperior;
    $scope.cliente.responsavel_superior_id = responsavelSuperior.id;
    $scope.pesquisarNovoResponsavelSuperior = false;
  };

  $scope.submeter = function() {
    if ($("#pesquisa_cliente_responsavel input:focus").length) {
      $scope.submeterPesquisaClienteResponsavel();
      return;
    };

    if ($("#endereco_form input:focus").length) {
      $scope.adicionarEndereco();
      return;
    };

    gerarAtributosDeEnderecos();

    var cliente = new Cliente({cliente: $scope.cliente});
    cliente.$save(function() {
      Flash.setMessage("Cliente criado com sucesso");
      $location.url("/clientes");
    }, function(response) {
      $scope.formErrors = response.data.errors;
    });
  }

  var gerarAtributosDeEnderecos = function() {
    $scope.cliente.enderecos_attributes = [];

    var enderecos = $scope.cliente.enderecos;
    $.each(enderecos, function(index, endereco) {
      endereco.logradouro_id        = endereco.logradouro.id,
      endereco.endereco_tipo_id     = endereco.endereco_tipo.id,
      endereco.logradouro_bairro_id = endereco.logradouro_bairro.id,
      endereco.logradouro_cep_id    = endereco.logradouro_cep.id,
      endereco.referencia_id        = endereco.referencia.id,
      endereco.perimetro_inicial_id = endereco.perimetro_inicial.id,
      endereco.perimetro_final_id   = endereco.perimetro_final.id

      $scope.cliente.enderecos_attributes.push(endereco)
    });
  };
}]);







