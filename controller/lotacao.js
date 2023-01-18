angular
    .module("lotacaoModulo", ['angularUtils.directives.dirPagination'])
    .value('urlBase', 'http://www.poatransporte.com.br/php/facades/process.php?a=nc&p=%25&t=l')
    .controller(
        "lotacaoController",
        function($http, urlBase) {
            var self = this;

            self.lotacoes = [];
            self.lotacao = undefined;

            self.salvar = function() {
                var metodo = 'POST';
                if (self.lotacao.id) {
                    metodo = 'PUT';
                }

                $http({
                        method: metodo,
                        url: urlBase + '/',
                        data: self.lotacao
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
                                msg: ' lotacao ' +
                                    self.lotacao.nome +
                                    ' ' + msgTipo +
                                    ' com sucesso!'
                            }];
                        },
                        function errorCallback(response) {
                            if (response.status === 401) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: 'ATENÇÃO! já existe. ' +
                                        self.lotacao.placa +
                                        ' - ' +
                                        self.lotacao.nome +
                                        '!'
                                }];
                            } else if (response.status === 500) {
                                self.alerts = [{
                                    type: 'error',
                                    msg: ' Ocorreu um erro ao tentar salvar ' +
                                        self.lotacao.nome +
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
                                        self.lotacao.nome +
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
                    self.lotacoes = response.data;
                    self.lotacao = undefined;
                }, function errorCallback(response) {
                    self.ocorreuErro();
                });
            };

            self.deletar = function(lotacao) {
                swal({
                        title: " Deseja realmente deletar " +
                            self.lotacao.nome + " ?",
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
                                    self.lotacao.id + '/'
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
                                            " Ocorreu um erro ao tentar deletar lotacao!",
                                            "error");
                                    }
                                });
                    });
            };

            self.removeRow = function(lotacaoTabela) {

                swal({
                        title: "Deseja realmente deletar " +
                            lotacaoTabela.nome + " ?",
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
                                url: urlBase + 'lotacao/' +
                                    lotacaoTabela.id + '/'
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
                                            " Ocorreu um erro ao tentar deletar lotacao!",
                                            "error");
                                    }
                                });
                    });
            }

            self.selecionarLotacao = function(lotacoeselecionado) {
                self.lotacao = lotacoeselecionado;

                $('.nav li.active').next('li').find('a').attr(
                    "data-toggle", "tab").trigger("click");
            }

            self.activate = function() {
                self.atualizarTabela();
            };
            self.activate();
        });