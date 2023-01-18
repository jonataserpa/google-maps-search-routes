angular
    .module("onibusModulo", ['angularUtils.directives.dirPagination'])
    .value('urlBase', 'http://www.poatransporte.com.br/php/facades/process.php?a=nc&p=%25&t=o')
    .controller(
        "onibusController",
        function($http, urlBase) {
            var self = this;

            self.listOnibus = [];
            self.onibus = undefined;

            self.salvar = function() {
                var metodo = 'POST';
                if (self.onibus.id) {
                    metodo = 'PUT';
                }

                $http({
                        method: metodo,
                        url: urlBase + '/',
                        data: self.onibus
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
                                msg: ' onibus ' +
                                    self.onibus.nome +
                                    ' ' + msgTipo +
                                    ' com sucesso!'
                            }];
                        },
                        function errorCallback(response) {
                            if (response.status === 401) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: 'ATENÇÃO! já existe. ' +
                                        self.onibus.placa +
                                        ' - ' +
                                        self.onibus.nome +
                                        '!'
                                }];
                            } else if (response.status === 500) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: ' Ocorreu um erro ao tentar salvar ' +
                                        self.onibus.nome +
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
                                        self.onibus.nome +
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
                    self.listOnibus = response.data;
                    self.onibus = undefined;
                }, function errorCallback(response) {
                    self.ocorreuErro();
                });
            };

            self.deletar = function(onibus) {
                swal({
                        title: " Deseja realmente deletar " +
                            self.onibus.nome + " ?",
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
                                    self.onibus.id + '/'
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
                                            " Ocorreu um erro ao tentar deletar onibus!",
                                            "error");
                                    }
                                });
                    });
            };

            self.removeRow = function(onibusTabela) {

                swal({
                        title: "Deseja realmente deletar " +
                            onibusTabela.nome + " ?",
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
                                url: urlBase + 'onibus/' +
                                    onibusTabela.id + '/'
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
                                            " Ocorreu um erro ao tentar deletar onibus!",
                                            "error");
                                    }
                                });
                    });
            }

            self.selecionarCarro = function(listOnibuselecionado) {
                self.onibus = listOnibuselecionado;

                $('.nav li.active').next('li').find('a').attr(
                    "data-toggle", "tab").trigger("click");
            }

            self.activate = function() {
                self.atualizarTabela();
            };
            self.activate();
        });