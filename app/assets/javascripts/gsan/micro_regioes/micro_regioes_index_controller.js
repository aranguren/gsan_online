var app = angular.module("gsan");

app.controller("MicroRegioesIndexController", ["Regiao", "MicroRegiao", "Flash", "$scope", "$http", "CadastroUrl", function(Regiao, MicroRegiao, Flash, $scope, $http, CadastroUrl) {
  $scope.flash = Flash;
  $scope.regioes = Regiao.query();
  $scope.query = {};

  $scope.queryVazia = function() {
    for(var input in $scope.query) {
      if ($scope.query[input] !== "" && $scope.query[input] !== undefined) {
        return false;
      }
    }
    return true;
  }

  $scope.pesquisar = function() {
    var copiedQuery = jQuery.extend({}, $scope.query);
    $scope.queryCache = { query: copiedQuery };
    $scope.submeterPesquisa();
  }

  $scope.submeterPesquisa = function() {
    var query = $.param($scope.queryCache);
    $scope.loading = true;

    $http.get(
      CadastroUrl() + "/micro_regioes?" + query
    )
    .success(function(data) {
      $scope.microRegioes = data.micro_regioes;
      $scope.page = data.page;
      $scope.loading = false;
    })
    .error(function() {
      $scope.loading = false;
    });
  }

}]);
