var app = angular.module("gsan");

app.controller("CepsNewController", ["Cep", "CepTipo", "Municipio", "TipoLogradouro", "CadastroUrl", "$scope", "$http", "$location", "Flash", "breadcrumbs", function(Cep, CepTipo, Municipio, TipoLogradouro, CadastroUrl, $scope, $http, $location, Flash, breadcrumbs) {
  $scope.cepTipos = CepTipo.query();
  $scope.municipios = Municipio.query();
  $scope.tipo_logradouros = TipoLogradouro.query();
  $scope.breadcrumbs = breadcrumbs;

  $scope.cep = {ativo: 1};

  $scope.atualizaBairros = function() {
    $scope.cep.bairro = "";
    $scope.cep.muni_id = $scope.cep.municipio.id;

    var query = $.param({ query: { municipio_id: $scope.cep.municipio.id}, paginado: false })
    $http.get(CadastroUrl() + "/bairros?" + query).success(function(data) {
      $scope.bairros = data.bairros;
    });
  }

  $scope.submeter = function() {
    var cep = new Cep({cep: $scope.cep});
    cep.$save(function() {
      Flash.setMessage("CEP criado com sucesso");
      $location.url("/ceps");
    }, function(response) {
      $scope.formErrors = response.data.errors;
    });
  }
}]);
