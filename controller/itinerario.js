angular
    .module("itinerarioModulo", ['angularUtils.directives.dirPagination'])
    .value('urlBase', 'http://www.poatransporte.com.br/php/facades/process.php?a=il&p=5527')
    .controller(
        "itinerarioController",
        function($http, urlBase) {
            var self = this;

            self.itinerarios = [];
            self.itinerario = undefined;

            self.salvar = function() {
                var metodo = 'POST';
                if (self.itinerario.id) {
                    metodo = 'PUT';
                }

                $http({
                        method: metodo,
                        url: urlBase + '/',
                        data: self.itinerario
                    })
                    .then(
                        function successCallback(response) {
                            self.atualizarTabela();
                            var msgTipo = null;
                            if (response.config.method === "PUT") {
                                msgTipo = "alterado";
                            } else {
                                msgTipo = "salvo";
                            }
                            self.alerts = [{
                                type: 'success',
                                msg: ' itinerario ' +
                                    self.itinerario.nome +
                                    ' ' + msgTipo +
                                    ' com sucesso!'
                            }];
                        },
                        function errorCallback(response) {
                            if (response.status === 401) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: 'ATENÇÃO! já existe. ' +
                                        self.itinerario.placa +
                                        ' - ' +
                                        self.itinerario.nome +
                                        '!'
                                }];
                            } else if (response.status === 500) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: ' Ocorreu um erro ao tentar salvar ' +
                                        self.itinerario.nome +
                                        '!'
                                }];
                            } else {
                                var msgTipo = null;
                                if (response.config.method === "PUT") {
                                    msgTipo = "alterar";
                                } else {
                                    msgTipo = "salvar";
                                }
                                self.alerts = [{
                                    type: 'error',
                                    msg: ' Ocorreu um erro ao tentar ' +
                                        msgTipo +
                                        self.itinerario.nome +
                                        '!'
                                }];
                            }
                        });
            };

            self.ocorreuErro = function() {
                alert("Ocorreu um erro inesperado!");
            };

            self.atualizarTabela = function() {
                $http({
                    method: 'GET',
                    url: urlBase + ''
                }).then(function successCallback(response) {
                    self.itinerarios = response.data;
                    self.itinerario = undefined;
                }, function errorCallback(response) {
                    self.ocorreuErro();
                });
            };

            self.deletar = function(itinerario) {
                swal({
                        title: " Deseja realmente deletar " +
                            self.itinerario.nome + " ?",
                        text: " Dados serão atualizados! ",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Sim!',
                        closeOnConfirm: false
                    },
                    function() {
                        $http({
                                method: 'DELETE',
                                url: urlBase + '' +
                                    self.itinerario.id + '/'
                            })
                            .then(
                                function successCallback(
                                    response) {
                                    self.atualizarTabela();
                                    swal(
                                        "Deletado com sucesso!",
                                        "dados foram atualizados!");
                                },
                                function errorCallback(
                                    response) {
                                    if (response.status === 401) {
                                        swal(
                                            "ATENÇÃO! Não é Possivel deletar dado pois está sendo usado(a) em outro Registro!",
                                            "error");
                                    } else if (response.status === 500) {
                                        swal(
                                            " Ocorreu um erro ao tentar deletar itinerario!",
                                            "error");
                                    }
                                });
                    });
            };

            self.removeRow = function(itinerarioTabela) {

                swal({
                        title: "Deseja realmente deletar " +
                            itinerarioTabela.nome + " ?",
                        text: " Os Dados serão atualizados! ",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Sim!',
                        closeOnConfirm: false
                    },
                    function() {
                        $http({
                                method: 'DELETE',
                                url: urlBase + 'itinerario/' +
                                    itinerarioTabela.id + '/'
                            })
                            .then(
                                function successCallback(
                                    response) {
                                    self.atualizarTabela();
                                    swal(
                                        "Deletado com sucesso!",
                                        "dados foram atualizados!");
                                },
                                function errorCallback(
                                    response) {
                                    if (response.status === 401) {
                                        swal(
                                            "ATENÇÃO! Não é Possivel deletar dado pois está sendo usado(a) em outro Registro!",
                                            "error");
                                    } else if (response.status === 500) {
                                        swal(
                                            " Ocorreu um erro ao tentar deletar itinerario!",
                                            "error");
                                    }
                                });
                    });
            }

            self.selecionarItinerario = function(itinerarioselecionado) {
                self.itinerario = itinerarioselecionado;

                $('.nav li.active').next('li').find('a').attr(
                    "data-toggle", "tab").trigger("click");
            }

            self.activate = function() {
                self.atualizarTabela();
            };
            self.activate();
        });