(function () {
  "use strict";

  angular
    .module("appmadecentro")

    .controller("ProveedorPlanta", [
      "$scope",
      "$http",
      "$upload",
      "TreidConfigSrv",
      "loginService",
      "$timeout",
      "$q",
      "$location",
      "$compile",
      "$cookieStore",
      "$rootScope",
      "$templateCache",
      "datepickerPopupConfig",
      "ngProgressFactory",
      "blockUI",
      "ProveedoresPlantaService",
      function (
        $scope,
        $http,
        $upload,
        TreidConfigSrv,
        loginService,
        $timeout,
        $q,
        $location,
        $compile,
        $cookieStore,
        $rootScope,
        $templateCache,
        datepickerPopupConfig,
        ngProgressFactory,
        blockUI,
        ProveedoresPlantaService,
      ) {
        var vm = $scope;
        vm.init = function () {
          $rootScope.log_usuario.nombre = loginService.UserData.Usuario;
          $rootScope.log_usuario.cargo = loginService.UserData.d_cargo;
          vm.action = "";

          //objects
          vm.c_compania_erp = "";
          vm.id_motivo = "";
          vm.id_sucursal = "";
          vm.id_moneda = "";
          vm.id_condicion_pago = "";
          vm.correos = "";
          vm.cedula_comprador = "";
          vm.nit = "";
          vm.descripcion_planta = "";
          vm.obj_ctrl = {};
          vm.filtroProveedor = "";
          vm.dataPlantas = "";
          vm.info = {
            proveedores: [],
          };
          vm.mostrar = false;
          vm.Razon_social = "";
          vm.sw_moneda_local = false;
          vm.sw_tasa_local = false;
          vm.sw_importacion = false;
          /** Internal functions **/
          vm.loadBasicFunctions = function () {};

          vm.insertar_planta = function () {
            if (vm.descripcion_planta == "") {
              toastr.info("Por favor ingrese una descripción");
              return;
            }

            if (vm.cedula_comprador == "" || vm.cedula_comprador == null) {
              toastr.info("Por favor ingrese una cédula de comprador");
              return;
            }
            if (vm.c_compania_erp == "" || vm.c_compania_erp == null) {
              toastr.info("Por favor seleccione una compañía");
              return;
            }

            if (vm.id_sucursal == "" || vm.id_sucursal == null) {
              toastr.info("Por favor seleccione una sucursal");
              return;
            }
            if (vm.id_moneda == "" || vm.id_moneda == null) {
              toastr.info("Por favor seleccione una moneda");
              return;
            }
            if (vm.id_condicion_pago == "" || vm.id_condicion_pago == null) {
              toastr.info("Por favor seleccione una condición de pago");
              return;
            }
            if (vm.id_motivo == "" || vm.id_motivo == null) {
              toastr.info("Por favor seleccione un motivo");
              return;
            }
            if (vm.correos == "" || vm.correos == null) {
              toastr.info("Por favor ingrese al menos un correo");
              return;
            }

            vm.request = {
              nit: vm.nit,
              detalle: vm.descripcion_planta.toUpperCase(),
              cedula_comprador: vm.cedula_comprador,
              id_cia: vm.c_compania_erp,
              c_sucursal: vm.id_sucursal,
              c_moneda: vm.id_moneda,
              c_condicion_pago: vm.id_condicion_pago,
              c_motivo: vm.id_motivo,
              correos: vm.correos,
              sw_moneda_local: vm.sw_moneda_local,
              sw_formato_importacion: vm.sw_importacion,
              sw_tasa_local: vm.sw_tasa_local,

              log: loginService.UserData.cs_IdUsuario,
            };

            ProveedoresPlantaService.insertar_planta(vm.request).then(
              function (res) {
                if (res.MSG == "OK") {
                  vm.descripcion_planta = "";
                  toastr.success("Planta agregada correctamente");
                  vm.dataPlantas = [];
                  ProveedoresPlantaService.getPlantas(vm.nit).then(
                    function (res) {
                      if (res.data.length > 0 && res.data[0].length > 0) {
                        vm.dataPlantas = res.data[0];
                      } else {
                        console.log("No se encontraron proveedores");
                      }
                    },
                  );
                  vm.closeModal("ModalAddPlanta");
                } else if (res.MSG == "EXISTE") {
                  toastr.info("El detalle de la planta ya existe");
                  vm.descripcion_planta = "";
                } else {
                  console.log("No se encontraron proveedores");
                  vm.descripcion_planta = "";
                }
              },
            );
          };
          vm.clearSelect2 = function (id) {
            $("#" + id).select2("val", "");
          };

          vm.obtenerPlantas = function (proveedor) {
            console.log(proveedor);

            vm.proveedores = [];
            console.log(vm.Razon_social);
            vm.nit = vm.Razon_social;
            vm.mostrar = true;
            ProveedoresPlantaService.getPlantas(vm.nit).then(function (res) {
              if (res.data.length > 0 && res.data[0].length > 0) {
                vm.dataPlantas = res.data[0];
              } else {
                console.log("No se encontraron proveedores");
              }
            });

            /* vm.nit_proveedor = proveedor.Proveedor */
          };

          vm.obtenerCompanias = function () {
            vm.c_compania_erp = "";
            
            vm.lista_companias = [];
            vm.clearSelect2("select_compania");
            ProveedoresPlantaService.get_companias().then(function (res) {
              if (res.data.length > 0 && res.data[0].length > 0) {
                vm.lista_companias = res.data[0];
                $timeout(function () {
                  $("#select_compania").select2({});
                }, 50);
              } else {
                console.log("No se encontraron compañias");
              }
            });
          };

          vm.obtenerCompanias();

          vm.obtenerMotivos = function () {
            vm.clearSelect2("select_motivo");
            vm.id_motivo = "";
            vm.lista_motivos = [];
            ProveedoresPlantaService.get_motivos(vm.c_compania_erp).then(
              function (res) {
                if (res.data.length > 0 && res.data[0].length > 0) {
                  vm.lista_motivos = res.data[0];
                  $timeout(function () {
                    $("#select_motivo").select2({});
                  }, 50);
                } else {
                  console.log("No se encontraron motivos");
                }
              },
            );
          };

          vm.obtenerSucursales = function () {
            vm.clearSelect2("select_sucursal");
            console.log(vm.Razon_social);
            vm.id_sucursal = "";
            vm.lista_sucursales = [];
            ProveedoresPlantaService.get_sucursales(
              vm.c_compania_erp,
              vm.Razon_social,
            ).then(function (res) {
              if (res.data.length > 0 && res.data[0].length > 0) {
                vm.lista_sucursales = res.data[0];

                $timeout(function () {
                  $("#select_sucursal").select2({});
                }, 50);
              } else {
                console.log("No se encontraron sucursales");
              }
            });
          };

          vm.obtenerMonedas = function () {
            vm.clearSelect2("select_moneda");
            vm.id_moneda = "";
            vm.lista_monedas = [];
            ProveedoresPlantaService.get_monedas(vm.c_compania_erp).then(
              function (res) {
                if (res.data.length > 0 && res.data[0].length > 0) {
                  vm.lista_monedas = res.data[0];

                  $timeout(function () {
                    $("#select_moneda").select2({});
                  }, 50);
                } else {
                  console.log("No se encontraron monedas");
                }
              },
            );
          };

          vm.obtenerCondicionesPago = function () {
            vm.clearSelect2("select_condicion_pago");
            vm.id_condicion_pago = "";
            vm.lista_condiciones_pago = [];
            ProveedoresPlantaService.get_condiciones_pago(
              vm.c_compania_erp,
            ).then(function (res) {
              if (res.data.length > 0 && res.data[0].length > 0) {
                vm.lista_condiciones_pago = res.data[0];

                $timeout(function () {
                  $("#select_condicion_pago").select2({});
                }, 50);
              } else {
                console.log("No se encontraron condiciones de pago");
              }
            });
          };

          vm.getProveedores = function (filtro) {
            if (filtro.length > 3) {
              ProveedoresPlantaService.getProveedores(filtro).then(
                function (res) {
                  if (res.data.length > 0 && res.data[0].length > 0) {
                    vm.info.proveedores = res.data[0];
                    vm.mostrar = true;

                    vm.clearSelect2("selectProveedor");

                    $timeout(function () {
                      $("#selectProveedor").select2({});
                    }, 50);
                  } else {
                    console.log("No se encontraron proveedores");
                  }
                },
              );
            } else {
              toastr.info("Debe ingresar mínimo cuatro dígitos");
            }
          };

          vm.complete = function (string) {
            vm.hidethis = false;
            var output = [];
            angular.forEach(vm.proveedores, function (proveedores) {
              console.log(proveedores.Razon_social);
              if (
                proveedores.Razon_social.toLowerCase().indexOf(
                  string.toLowerCase(),
                ) >= 0
              ) {
                output.push(proveedores);
              }
            });
            vm.filterProveedores = output;
          };
          vm.fillTextbox = function (string) {
            vm.proveedores = string;
            vm.hidethis = true;
          };

          vm.update_planta = async function () {
            if (vm.descripcion_planta_update == "") {
              toastr.info("Por favor ingrese una descripción");
              return;
            }
            if (
              vm.cedula_comprador_update == "" ||
              vm.cedula_comprador_update == null
            ) {
              toastr.info("Por favor ingrese una cédula de comprador");
              return;
            }
            if (vm.correos_update == "" || vm.correos_update == null) {
              toastr.info("Por favor ingrese al menos un correo");
              return;
            }

            vm.request_update = {
              nit: vm.nit,
              detalle: vm.descripcion_planta_update.toUpperCase(),
              cedula_comprador: vm.cedula_comprador_update,
              id_cia: vm.c_compania_erp_update,
              c_sucursal: vm.id_sucursal_update,
              c_moneda: vm.id_moneda_update,
              c_condicion_pago: vm.id_condicion_pago_update,
              c_motivo: vm.id_motivo_update,
              correos: vm.correos_update,
              sw_moneda_local: vm.sw_moneda_local_update,
              sw_tasa_local: vm.sw_tasa_local_update,
              sw_formato_importacion: vm.sw_importacion_update,
              sw_activo: vm.sw_activo_update,
              log: loginService.UserData.cs_IdUsuario,
              cs_id: vm.cs_id,
            };

            await ProveedoresPlantaService.update_planta(
              vm.request_update,
            ).then(function (res) {
              console.log(res);
              if (res.MSG == "OK") {
                toastr.success("Planta actualizada");
                vm.dataPlantas = [];
                ProveedoresPlantaService.getPlantas(vm.nit).then(
                  function (res) {
                    if (res.data.length > 0 && res.data[0].length > 0) {
                      vm.dataPlantas = res.data[0];
                    } else {
                      console.log("No se encontraron proveedores");
                    }
                  },
                );
                vm.closeModal("ModalUpdatePlanta");
              } else if (res.MSG == "EXISTE") {
                toastr.info("El detalle de la planta ya existe");
              } else {
                console.log("No se encontraron proveedores");
              }
            });
          };

          vm.validar_cedula = function () {
            if (vm.cedula_comprador != "" && vm.cedula_comprador != null) {
              ProveedoresPlantaService.validar_cedula_comprador(
                vm.cedula_comprador,
              ).then(function (res) {
                if (res.MSG == "NO_EXISTE") {
                  toastr.error("Cédula no válida");
                  vm.cedula_comprador = "";
                  vm.cedula_comprador_update = "";
                }
              });
            }
          };

          vm.Modal = function (modalX) {
            vm.action = "";

            console.log("modal", modalX);
            $timeout(function () {
              //Clone information
              if (!modalX) {
                console.log("Se clono la información");
              } else {
                vm.openModal(modalX);
                console.log("Se clono la información y se abre modal");
              }
            }, 300);
          };

          vm.ModalUpdate = function (modalX, item) {
            console.log(item.c_condicion_pago_proveedor);
            vm.lista_motivos = [];
            vm.lista_sucursales = [];
            vm.lista_monedas = [];
            vm.lista_condiciones_pago = [];

            vm.c_compania_erp = item.c_compania_erp;
            if (vm.c_compania_erp != "" && vm.c_compania_erp != null) {
              vm.obtenerMotivos();
              vm.obtenerSucursales();
              vm.obtenerMonedas();
              vm.obtenerCondicionesPago();
            }

            vm.descripcion_planta_update =
              item.d_proveedor_planta.toUpperCase();
            vm.cedula_comprador_update = item.cedula_comprador;
            vm.correos_update = item.correos;
            vm.c_compania_erp_update = item.c_compania_erp;

            vm.id_sucursal_update = item.c_sucursal_proveedor;
            vm.id_moneda_update = item.c_moneda;
            vm.id_condicion_pago_update = item.c_condicion_pago_proveedor;
            vm.id_motivo_update = item.c_motivo;
            vm.sw_importacion_update = item.sw_formato_importacion;
            vm.sw_moneda_local_update = item.sw_moneda_local;
            vm.sw_tasa_local_update = item.sw_tasa_local;
            vm.sw_activo_update = item.sw_activo;
            vm.cs_id = item.c_id_proveedor_planta;

            $timeout(function () {
              //Clone information
              if (!modalX) {
                console.log("Se clono la información");
              } else {
                vm.openModal(modalX);
                console.log("Se clono la información y se abre modal");
              }
            }, 300);
          };

          vm.clear = function () {
            vm.descripcion_planta = "";

            vm.filtroProveedor = "";
            vm.dataPlantas = "";
            vm.nit = "";
            vm.info.proveedores = [];
            vm.proveedores = [];
            vm.mostrar = false;
            vm.clearSelect2("selectProveedor");
            vm.clearSelect2("select_compania");
            vm.clearSelect2("select_sucursal");
            vm.clearSelect2("select_motivo");
            vm.clearSelect2("select_condicion_pago");
            vm.clearSelect2("select_moneda");
            vm.Razon_social = "";
          };

          vm.openModal = function (modal) {
            $("#" + modal).modal("show");
          };

          vm.closeModal = function (modal) {
            $("#" + modal).modal("hide");
            vm.clearSelect2("select_compania");
            vm.clearSelect2("select_sucursal");
            vm.clearSelect2("select_motivo");
            vm.clearSelect2("select_condicion_pago");
            vm.clearSelect2("select_moneda");
            vm.cedula_comprador = "";
            vm.correos = "";
          };

          vm.loadBasicFunctions();
          vm.RedirectTo = function (pathname) {
            $location.path(pathname);
            $rootScope.actualPage = pathname;
          };

          vm.cookieUser = {};
          vm.cookieUser = $cookieStore.get("serviceLogIn");
          if (vm.cookieUser != null) {
            if (
              vm.cookieUser.hasSession &&
              vm.cookieUser.UserData.cs_IdUsuario ==
                loginService.UserData.cs_IdUsuario
            ) {
              if ($location.$$path == "/ProveedorPlanta") {
                $rootScope.$$childHead.showmodal = false;
                $rootScope.actualPage = "/ProveedorPlanta";
                // vm.init();
              }
            } else {
              $rootScope.$$childHead.showmodal = true;
              vm.RedirectTo("/");
            }
          } else {
            vm.RedirectTo("/");
            $rootScope.$$childHead.showmodal = true;
          }
        };
        vm.init();
      },
    ]);
})();
