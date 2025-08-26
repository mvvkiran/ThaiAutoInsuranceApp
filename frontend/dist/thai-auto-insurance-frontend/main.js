"use strict";
(self["webpackChunkthai_auto_insurance_frontend"] = self["webpackChunkthai_auto_insurance_frontend"] || []).push([["main"],{

/***/ 4114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/guards/auth.guard */ 4978);
/* harmony import */ var _core_guards_role_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/guards/role.guard */ 400);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);





const routes = [
// Default route - redirect to dashboard if authenticated, login if not
{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
},
// Authentication routes (lazy loaded)
{
  path: 'auth',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_auth_auth_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/auth/auth.module */ 663)).then(m => m.AuthModule)
},
// Dashboard route (protected)
{
  path: 'dashboard',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_dashboard_dashboard_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/dashboard/dashboard.module */ 2125)).then(m => m.DashboardModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
},
// Customer routes (protected)
{
  path: 'customer',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_customer_customer_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/customer/customer.module */ 1371)).then(m => m.CustomerModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
},
// Policy routes (protected)
{
  path: 'policies',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_policy_policy_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/policy/policy.module */ 875)).then(m => m.PolicyModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
},
// Claims routes (protected)
{
  path: 'claims',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_claims_claims_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/claims/claims.module */ 5517)).then(m => m.ClaimsModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
},
// Admin routes (protected with role check)
{
  path: 'admin',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_admin_admin_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/admin/admin.module */ 6269)).then(m => m.AdminModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard, _core_guards_role_guard__WEBPACK_IMPORTED_MODULE_1__.RoleGuard],
  data: {
    roles: ['ADMIN', 'SUPER_ADMIN']
  }
},
// Profile and settings routes (protected)
{
  path: 'profile',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_customer_customer_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./features/customer/customer.module */ 1371)).then(m => m.CustomerModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
},
// Catch all route - redirect to dashboard
{
  path: '**',
  redirectTo: '/dashboard'
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(t) {
      return new (t || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forRoot(routes, {
        // Enable router tracing for debugging (only in development)
        enableTracing: false,
        // Preload all lazy loaded modules for better performance
        preloadingStrategy: undefined,
        // Scroll to top on route change
        scrollPositionRestoration: 'top',
        // Hash location strategy for deployment compatibility
        useHash: false
      }), _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
  });
})();

/***/ }),

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 1567);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/services/auth.service */ 8010);
/* harmony import */ var _core_services_loading_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/services/loading.service */ 8660);
/* harmony import */ var _core_services_translation_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/services/translation.service */ 2243);
/* harmony import */ var _core_services_notification_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/services/notification.service */ 5567);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/cdk/layout */ 7912);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/toolbar */ 9552);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/sidenav */ 7049);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/list */ 943);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/progress-spinner */ 1134);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/badge */ 6256);





















function AppComponent_mat_toolbar_1_mat_spinner_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "mat-spinner", 25);
  }
}
function AppComponent_mat_toolbar_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-toolbar", 6)(1, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.toggleSidenav());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "menu");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_div_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo("/dashboard"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "mat-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "directions_car");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, AppComponent_mat_toolbar_1_mat_spinner_10_Template, 1, 0, "mat-spinner", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo("/notifications"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "mat-icon", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, " notifications ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.toggleLanguage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "button", 17)(20, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "account_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "mat-menu", 18, 0)(24, "div", 19)(25, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](31, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_32_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo("/profile"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](33, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](34, "person");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](35, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](37, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_37_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo("/settings"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](38, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](39, "settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](40, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](42, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](43, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_toolbar_1_Template_button_click_43_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.logout());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](44, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](45, "exit_to_app");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](46, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const userMenu_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](23);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", ctx_r1.translationService.instant("common.menu"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("common.appName"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", ctx_r1.translationService.instant("navigation.notifications"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matBadge", ctx_r1.unreadNotifications)("matBadgeHidden", ctx_r1.unreadNotifications === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", ctx_r1.translationService.instant("common.changeLanguage"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.currentLanguage.toUpperCase());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matMenuTriggerFor", userMenu_r3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", ctx_r1.translationService.instant("user.userMenu"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.getUserDisplayName());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.getUserRoleDisplay());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.currentUser == null ? null : ctx_r1.currentUser.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("navigation.profile"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("navigation.settings"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("auth.logout"));
  }
}
function AppComponent_mat_sidenav_container_2_ng_container_3_mat_list_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-list-item", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_sidenav_container_2_ng_container_3_mat_list_item_1_Template_mat_list_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const item_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo(item_r5.route));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "mat-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("active", ctx_r1.isRouteActive(item_r5.route));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](item_r5.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant(item_r5.labelKey));
  }
}
function AppComponent_mat_sidenav_container_2_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, AppComponent_mat_sidenav_container_2_ng_container_3_mat_list_item_1_Template, 5, 4, "mat-list-item", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !item_r5.requiresAuth || ctx_r1.isAuthenticated);
  }
}
function AppComponent_mat_sidenav_container_2_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-divider");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "h3", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "mat-list-item", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function AppComponent_mat_sidenav_container_2_ng_container_4_Template_mat_list_item_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r1.navigateTo("/admin"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "mat-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "admin_panel_settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r1.translationService.instant("navigation.admin"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("active", ctx_r1.isRouteActive("/admin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("navigation.admin"));
  }
}
function AppComponent_mat_sidenav_container_2_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 42)(1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "mat-spinner", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("common.loading"));
  }
}
function AppComponent_mat_sidenav_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-sidenav-container", 26)(1, "mat-sidenav", 27)(2, "mat-nav-list", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, AppComponent_mat_sidenav_container_2_ng_container_3_Template, 2, 1, "ng-container", 29)(4, AppComponent_mat_sidenav_container_2_ng_container_4_Template, 9, 4, "ng-container", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 31)(6, "div", 32)(7, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "v1.0.0");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "mat-sidenav-content", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, AppComponent_mat_sidenav_container_2_div_10_Template, 5, 1, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](12, "router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("hasBackdrop", ctx_r1.isMobile);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r1.isMobile ? "over" : "side")("opened", ctx_r1.sidenavOpened)("fixedInViewport", true)("fixedTopGap", ctx_r1.isMobile ? 0 : 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r1.getNavigationItems());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.canAccessAdmin());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r1.isLoading);
  }
}
function AppComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function AppComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 47)(1, "mat-card", 48)(2, "mat-card-content")(3, "div", 49)(4, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "system_update");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "mat-card-actions")(9, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.translationService.instant("pwa.updateAvailable"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r1.translationService.instant("pwa.reload"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r1.translationService.instant("pwa.later"), " ");
  }
}
class AppComponent {
  constructor(authService, loadingService, translationService, notificationService, router, changeDetectorRef, media) {
    this.authService = authService;
    this.loadingService = loadingService;
    this.translationService = translationService;
    this.notificationService = notificationService;
    this.router = router;
    this.changeDetectorRef = changeDetectorRef;
    this.media = media;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
    this.title = 'Thai Auto Insurance';
    this.currentUser = null;
    this.isLoading = false;
    this.isAuthenticated = false;
    this.isMobile = false;
    this.sidenavOpened = true;
    this.currentLanguage = 'th';
    this.unreadNotifications = 0;
    // Setup mobile query listener
    this.mobileQuery = this.media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      this.isMobile = this.mobileQuery.matches;
      this.sidenavOpened = !this.isMobile;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;
    this.sidenavOpened = !this.isMobile;
  }
  ngOnInit() {
    this.initializeApp();
    this.setupSubscriptions();
    this.setupRouterEvents();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  initializeApp() {
    // Initialize translation service
    this.translationService.setLanguage('th').subscribe({
      error: error => console.error('Failed to load translations:', error)
    });
  }
  setupSubscriptions() {
    // Subscribe to authentication state
    this.authService.currentUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.changeDetectorRef.detectChanges();
    });
    // Subscribe to loading state
    this.loadingService.isLoading$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe(loading => {
      this.isLoading = loading;
      this.changeDetectorRef.detectChanges();
    });
    // Subscribe to language changes
    this.translationService.currentLanguage$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe(language => {
      this.currentLanguage = language;
      this.changeDetectorRef.detectChanges();
    });
    // Subscribe to notification count
    this.notificationService.unreadCount$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe(count => {
      this.unreadNotifications = count;
      this.changeDetectorRef.detectChanges();
    });
  }
  setupRouterEvents() {
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_8__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe(event => {
      // Close mobile menu after navigation
      if (this.isMobile) {
        this.sidenavOpened = false;
      }
      // Update page title based on route
      this.updatePageTitle(event.url);
    });
  }
  updatePageTitle(url) {
    let titleKey = 'common.appName';
    if (url.includes('/dashboard')) {
      titleKey = 'navigation.dashboard';
    } else if (url.includes('/policies')) {
      titleKey = 'navigation.policies';
    } else if (url.includes('/claims')) {
      titleKey = 'navigation.claims';
    } else if (url.includes('/profile')) {
      titleKey = 'navigation.profile';
    } else if (url.includes('/admin')) {
      titleKey = 'navigation.admin';
    }
    const translatedTitle = this.translationService.instant(titleKey);
    document.title = `${translatedTitle} | Thai Auto Insurance`;
  }
  // Public methods for template
  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
  toggleLanguage() {
    this.translationService.toggleLanguage().subscribe({
      error: error => console.error('Failed to toggle language:', error)
    });
  }
  logout() {
    this.authService.logout();
  }
  navigateTo(route) {
    this.router.navigate([route]);
    // Close mobile menu
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }
  // Navigation menu items
  getNavigationItems() {
    return [{
      route: '/dashboard',
      icon: 'dashboard',
      labelKey: 'navigation.dashboard',
      requiresAuth: true
    }, {
      route: '/policies',
      icon: 'description',
      labelKey: 'navigation.policies',
      requiresAuth: true
    }, {
      route: '/claims',
      icon: 'assignment',
      labelKey: 'navigation.claims',
      requiresAuth: true
    }, {
      route: '/profile',
      icon: 'person',
      labelKey: 'navigation.profile',
      requiresAuth: true
    }, {
      route: '/admin',
      icon: 'admin_panel_settings',
      labelKey: 'navigation.admin',
      requiresAuth: true
    }];
  }
  // Check if user can access admin routes
  canAccessAdmin() {
    return this.authService.isAdmin;
  }
  // Check if current route is active
  isRouteActive(route) {
    return this.router.url.startsWith(route);
  }
  // Format user display name
  getUserDisplayName() {
    if (!this.currentUser) return '';
    if (this.currentLanguage === 'th' && this.currentUser.firstNameThai && this.currentUser.lastNameThai) {
      return `${this.currentUser.firstNameThai} ${this.currentUser.lastNameThai}`;
    }
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }
  // Get user role display
  getUserRoleDisplay() {
    if (!this.currentUser) return '';
    return this.translationService.instant(`user.role.${this.currentUser.role}`);
  }
  static {
    this.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_loading_service__WEBPACK_IMPORTED_MODULE_1__.LoadingService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_translation_service__WEBPACK_IMPORTED_MODULE_2__.TranslationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_notification_service__WEBPACK_IMPORTED_MODULE_3__.NotificationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_4__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_9__.MediaMatcher));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 5,
      vars: 6,
      consts: [["userMenu", "matMenu"], [1, "app-container"], ["class", "app-toolbar", "color", "primary", 4, "ngIf"], ["class", "app-sidenav-container", 3, "hasBackdrop", 4, "ngIf"], ["class", "login-layout", 4, "ngIf"], ["class", "pwa-update-notification", 4, "ngIf"], ["color", "primary", 1, "app-toolbar"], ["mat-icon-button", "", 1, "menu-toggle-btn", 3, "click"], [1, "app-title", 3, "click"], [1, "app-logo"], [1, "app-name"], [1, "spacer"], ["class", "loading-indicator", "diameter", "24", "strokeWidth", "2", 4, "ngIf"], ["mat-icon-button", "", 1, "notification-btn", 3, "click"], ["matBadgeColor", "warn", 3, "matBadge", "matBadgeHidden"], ["mat-icon-button", "", 1, "language-btn", 3, "click"], [1, "language-indicator"], ["mat-icon-button", "", 1, "user-menu-btn", 3, "matMenuTriggerFor"], [1, "user-menu"], [1, "user-info"], [1, "user-name"], [1, "user-role"], [1, "user-email"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "logout-btn", 3, "click"], ["diameter", "24", "strokeWidth", "2", 1, "loading-indicator"], [1, "app-sidenav-container", 3, "hasBackdrop"], [1, "app-sidenav", 3, "mode", "opened", "fixedInViewport", "fixedTopGap"], [1, "navigation-list"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "sidenav-footer"], [1, "app-version"], [1, "main-content"], ["class", "global-loading-overlay", 4, "ngIf"], [1, "page-content"], ["class", "nav-item", 3, "active", "click", 4, "ngIf"], [1, "nav-item", 3, "click"], ["matListIcon", ""], ["matLine", ""], ["matSubheader", "", 1, "section-header"], [1, "nav-item", "admin-item", 3, "click"], [1, "global-loading-overlay"], [1, "loading-content"], ["diameter", "48"], [1, "loading-text"], [1, "login-layout"], [1, "pwa-update-notification"], [1, "update-card"], [1, "update-message"], ["mat-button", "", "color", "primary"], ["mat-button", ""]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, AppComponent_mat_toolbar_1_Template, 48, 16, "mat-toolbar", 2)(2, AppComponent_mat_sidenav_container_2_Template, 13, 8, "mat-sidenav-container", 3)(3, AppComponent_div_3_Template, 2, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, AppComponent_div_4_Template, 13, 3, "div", 5);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("mobile", ctx.isMobile);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isAuthenticated);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isAuthenticated);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.isAuthenticated);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", false);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterOutlet, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_11__.MatToolbar, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatSidenav, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatSidenavContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatSidenavContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIcon, _angular_material_list__WEBPACK_IMPORTED_MODULE_15__.MatNavList, _angular_material_list__WEBPACK_IMPORTED_MODULE_15__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_15__.MatListSubheaderCssMatStyler, _angular_material_divider__WEBPACK_IMPORTED_MODULE_16__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_17__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_17__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_17__.MatCardContent, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_18__.MatProgressSpinner, _angular_material_menu__WEBPACK_IMPORTED_MODULE_19__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_19__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_19__.MatMenuTrigger, _angular_material_badge__WEBPACK_IMPORTED_MODULE_20__.MatBadge],
      styles: [".app-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  overflow: hidden;\n}\n.app-container.mobile[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%] {\n  width: 280px;\n}\n\n.app-toolbar[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  height: 64px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 0 16px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.app-toolbar[_ngcontent-%COMP%]   .menu-toggle-btn[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .menu-toggle-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  height: 24px;\n  width: 24px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n.app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%]   .app-logo[_ngcontent-%COMP%] {\n  font-size: 28px;\n  height: 28px;\n  width: 28px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%]   .app-name[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.app-toolbar[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.app-toolbar[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .notification-btn[_ngcontent-%COMP%], .app-toolbar[_ngcontent-%COMP%]   .language-btn[_ngcontent-%COMP%], .app-toolbar[_ngcontent-%COMP%]   .user-menu-btn[_ngcontent-%COMP%] {\n  margin-left: 8px;\n  position: relative;\n}\n.app-toolbar[_ngcontent-%COMP%]   .notification-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], .app-toolbar[_ngcontent-%COMP%]   .language-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], .app-toolbar[_ngcontent-%COMP%]   .user-menu-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  height: 24px;\n  width: 24px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .language-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.app-toolbar[_ngcontent-%COMP%]   .language-btn[_ngcontent-%COMP%]   .language-indicator[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: bold;\n  position: absolute;\n  bottom: 2px;\n  right: 2px;\n  background: rgba(255, 255, 255, 0.9);\n  color: #1976d2;\n  padding: 1px 3px;\n  border-radius: 2px;\n  line-height: 1;\n}\n\n.user-menu[_ngcontent-%COMP%] {\n  min-width: 240px;\n}\n.user-menu[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%] {\n  padding: 16px;\n  background: rgba(25, 118, 210, 0.05);\n}\n.user-menu[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 16px;\n  margin-bottom: 4px;\n}\n.user-menu[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-role[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #666;\n  margin-bottom: 2px;\n}\n.user-menu[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-email[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #999;\n}\n.user-menu[_ngcontent-%COMP%]   .logout-btn[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n.user-menu[_ngcontent-%COMP%]   .logout-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n\n.app-sidenav-container[_ngcontent-%COMP%] {\n  flex: 1;\n  margin-top: 64px;\n}\n\n.app-sidenav[_ngcontent-%COMP%] {\n  width: 280px;\n  background: #fafafa;\n  border-right: 1px solid #e0e0e0;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%] {\n  padding-top: 16px;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%] {\n  margin: 4px 16px;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n  cursor: pointer;\n  height: 48px;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover {\n  background: rgba(25, 118, 210, 0.08);\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%] {\n  background: rgba(25, 118, 210, 0.12);\n  color: #1976d2;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1976d2;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.admin-item[_ngcontent-%COMP%] {\n  background: rgba(255, 152, 0, 0.1);\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.admin-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 152, 0, 0.2);\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.admin-item.active[_ngcontent-%COMP%] {\n  background: rgba(255, 152, 0, 0.3);\n  color: #ff9800;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.admin-item.active[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #ff9800;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  margin-right: 16px;\n  color: #666;\n}\n.app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 12px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  margin-top: 24px;\n  margin-bottom: 8px;\n}\n.app-sidenav[_ngcontent-%COMP%]   .sidenav-footer[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 16px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n  background: #f5f5f5;\n}\n.app-sidenav[_ngcontent-%COMP%]   .sidenav-footer[_ngcontent-%COMP%]   .app-version[_ngcontent-%COMP%] {\n  color: #999;\n}\n\n.main-content[_ngcontent-%COMP%] {\n  position: relative;\n  background: #f5f5f5;\n  min-height: calc(100vh - 64px);\n}\n\n.page-content[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1200px;\n  margin: 0 auto;\n  min-height: calc(100vh - 112px);\n}\n\n.global-loading-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(255, 255, 255, 0.8);\n  -webkit-backdrop-filter: blur(2px);\n          backdrop-filter: blur(2px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n.global-loading-overlay[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 16px;\n}\n.global-loading-overlay[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #666;\n  font-size: 14px;\n}\n\n.login-layout[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);\n  min-height: 100vh;\n}\n\n.pwa-update-notification[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 16px;\n  right: 16px;\n  z-index: 1000;\n}\n.pwa-update-notification[_ngcontent-%COMP%]   .update-card[_ngcontent-%COMP%] {\n  max-width: 320px;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n}\n.pwa-update-notification[_ngcontent-%COMP%]   .update-card[_ngcontent-%COMP%]   .update-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.pwa-update-notification[_ngcontent-%COMP%]   .update-card[_ngcontent-%COMP%]   .update-message[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4caf50;\n}\n\n@media (max-width: 768px) {\n  .app-toolbar[_ngcontent-%COMP%] {\n    padding: 0 12px;\n  }\n  .app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%]   .app-name[_ngcontent-%COMP%] {\n    font-size: 16px;\n  }\n  .page-content[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .app-sidenav[_ngcontent-%COMP%] {\n    width: 280px;\n  }\n}\n@media (max-width: 480px) {\n  .app-toolbar[_ngcontent-%COMP%] {\n    height: 56px;\n  }\n  .app-toolbar[_ngcontent-%COMP%]   .app-title[_ngcontent-%COMP%]   .app-name[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .app-sidenav-container[_ngcontent-%COMP%] {\n    margin-top: 56px;\n  }\n  .page-content[_ngcontent-%COMP%] {\n    padding: 12px;\n    min-height: calc(100vh - 80px);\n  }\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%] {\n  background: #303030;\n  border-right-color: #424242;\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08);\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%] {\n  background: rgba(25, 118, 210, 0.2);\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%]   .navigation-list[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.dark-theme[_ngcontent-%COMP%]   .app-sidenav[_ngcontent-%COMP%]   .sidenav-footer[_ngcontent-%COMP%] {\n  background: #424242;\n  border-top-color: #555555;\n}\n.dark-theme[_ngcontent-%COMP%]   .main-content[_ngcontent-%COMP%] {\n  background: #212121;\n  color: #ffffff;\n}\n\n@media print {\n  .app-toolbar[_ngcontent-%COMP%], .app-sidenav[_ngcontent-%COMP%], .global-loading-overlay[_ngcontent-%COMP%], .pwa-update-notification[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n  .main-content[_ngcontent-%COMP%] {\n    margin-top: 0 !important;\n  }\n  .page-content[_ngcontent-%COMP%] {\n    padding: 0 !important;\n  }\n}\n@media (prefers-contrast: high) {\n  .app-toolbar[_ngcontent-%COMP%], .app-sidenav[_ngcontent-%COMP%] {\n    border: 2px solid;\n  }\n  .nav-item[_ngcontent-%COMP%] {\n    border: 1px solid transparent;\n  }\n  .nav-item.active[_ngcontent-%COMP%] {\n    border-color: #1976d2;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *[_ngcontent-%COMP%] {\n    transition: none !important;\n    animation: none !important;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0FBREY7QUFJSTtFQUNFLFlBQUE7QUFGTjs7QUFRQTtFQUNFLGVBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0Esd0NBQUE7QUFMRjtBQU9FO0VBQ0UsaUJBQUE7QUFMSjtBQU9JO0VBQ0UsZUFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0FBTE47QUFTRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7QUFQSjtBQVNJO0VBQ0UsWUFBQTtBQVBOO0FBVUk7RUFDRSxlQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUFSTjtBQVdJO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7QUFUTjtBQWFFO0VBQ0UsT0FBQTtBQVhKO0FBY0U7RUFDRSxpQkFBQTtBQVpKO0FBZUU7OztFQUdFLGdCQUFBO0VBQ0Esa0JBQUE7QUFiSjtBQWVJOzs7RUFDRSxlQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUFYTjtBQWVFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQWJKO0FBZUk7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxVQUFBO0VBQ0Esb0NBQUE7RUFDQSxjQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7QUFiTjs7QUFtQkE7RUFDRSxnQkFBQTtBQWhCRjtBQWtCRTtFQUNFLGFBQUE7RUFDQSxvQ0FBQTtBQWhCSjtBQWtCSTtFQUNFLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0FBaEJOO0FBbUJJO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtBQWpCTjtBQW9CSTtFQUNFLGVBQUE7RUFDQSxXQUFBO0FBbEJOO0FBc0JFO0VBQ0UsY0FBQTtBQXBCSjtBQXNCSTtFQUNFLGNBQUE7QUFwQk47O0FBMEJBO0VBQ0UsT0FBQTtFQUNBLGdCQUFBO0FBdkJGOztBQTJCQTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtFQUNBLCtCQUFBO0FBeEJGO0FBMEJFO0VBQ0UsaUJBQUE7QUF4Qko7QUEwQkk7RUFDRSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtBQXhCTjtBQTBCTTtFQUNFLG9DQUFBO0FBeEJSO0FBMkJNO0VBQ0Usb0NBQUE7RUFDQSxjQUFBO0FBekJSO0FBMkJRO0VBQ0UsY0FBQTtBQXpCVjtBQTZCTTtFQUNFLGtDQUFBO0FBM0JSO0FBNkJRO0VBQ0Usa0NBQUE7QUEzQlY7QUE4QlE7RUFDRSxrQ0FBQTtFQUNBLGNBQUE7QUE1QlY7QUE4QlU7RUFDRSxjQUFBO0FBNUJaO0FBaUNNO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0FBL0JSO0FBbUNJO0VBQ0UsV0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBakNOO0FBcUNFO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FBbkNKO0FBcUNJO0VBQ0UsV0FBQTtBQW5DTjs7QUF5Q0E7RUFDRSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7QUF0Q0Y7O0FBeUNBO0VBQ0UsYUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLCtCQUFBO0FBdENGOztBQTBDQTtFQUNFLGVBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxTQUFBO0VBQ0Esb0NBQUE7RUFDQSxrQ0FBQTtVQUFBLDBCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0FBdkNGO0FBeUNFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FBdkNKO0FBeUNJO0VBQ0UsU0FBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0FBdkNOOztBQTZDQTtFQUNFLE9BQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLDZEQUFBO0VBQ0EsaUJBQUE7QUExQ0Y7O0FBOENBO0VBQ0UsZUFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtBQTNDRjtBQTZDRTtFQUNFLGdCQUFBO0VBQ0Esd0NBQUE7QUEzQ0o7QUE2Q0k7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FBM0NOO0FBNkNNO0VBQ0UsY0FBQTtBQTNDUjs7QUFrREE7RUFDRTtJQUNFLGVBQUE7RUEvQ0Y7RUFrREk7SUFDRSxlQUFBO0VBaEROO0VBcURBO0lBQ0UsYUFBQTtFQW5ERjtFQXNEQTtJQUNFLFlBQUE7RUFwREY7QUFDRjtBQXVEQTtFQUNFO0lBQ0UsWUFBQTtFQXJERjtFQXdESTtJQUNFLGFBQUE7RUF0RE47RUEyREE7SUFDRSxnQkFBQTtFQXpERjtFQTREQTtJQUNFLGFBQUE7SUFDQSw4QkFBQTtFQTFERjtBQUNGO0FBK0RFO0VBQ0UsbUJBQUE7RUFDQSwyQkFBQTtBQTdESjtBQWdFTTtFQUNFLGNBQUE7QUE5RFI7QUFnRVE7RUFDRSxxQ0FBQTtBQTlEVjtBQWlFUTtFQUNFLG1DQUFBO0FBL0RWO0FBa0VRO0VBQ0UsY0FBQTtBQWhFVjtBQXFFSTtFQUNFLG1CQUFBO0VBQ0EseUJBQUE7QUFuRU47QUF1RUU7RUFDRSxtQkFBQTtFQUNBLGNBQUE7QUFyRUo7O0FBMEVBO0VBQ0U7Ozs7SUFJRSx3QkFBQTtFQXZFRjtFQTBFQTtJQUNFLHdCQUFBO0VBeEVGO0VBMkVBO0lBQ0UscUJBQUE7RUF6RUY7QUFDRjtBQTZFQTtFQUNFOztJQUVFLGlCQUFBO0VBM0VGO0VBOEVBO0lBQ0UsNkJBQUE7RUE1RUY7RUE4RUU7SUFDRSxxQkFBQTtFQTVFSjtBQUNGO0FBaUZBO0VBQ0U7SUFDRSwyQkFBQTtJQUNBLDBCQUFBO0VBL0VGO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNYWluIEFwcGxpY2F0aW9uIFN0eWxlc1xuXG4uYXBwLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwdmg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgJi5tb2JpbGUge1xuICAgIC5hcHAtc2lkZW5hdiB7XG4gICAgICB3aWR0aDogMjgwcHg7XG4gICAgfVxuICB9XG59XG5cbi8vIFRvcCBUb29sYmFyIFN0eWxlc1xuLmFwcC10b29sYmFyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAxMDAwO1xuICBoZWlnaHQ6IDY0cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTZweDtcbiAgcGFkZGluZzogMCAxNnB4O1xuICBib3gtc2hhZG93OiAwIDJweCA0cHggcmdiYSgwLDAsMCwwLjEpO1xuXG4gIC5tZW51LXRvZ2dsZS1idG4ge1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuXG4gICAgLm1hdC1pY29uIHtcbiAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgIGhlaWdodDogMjRweDtcbiAgICAgIHdpZHRoOiAyNHB4O1xuICAgIH1cbiAgfVxuXG4gIC5hcHAtdGl0bGUge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEycHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIG9wYWNpdHk6IDAuODtcbiAgICB9XG5cbiAgICAuYXBwLWxvZ28ge1xuICAgICAgZm9udC1zaXplOiAyOHB4O1xuICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgd2lkdGg6IDI4cHg7XG4gICAgfVxuXG4gICAgLmFwcC1uYW1lIHtcbiAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIH1cbiAgfVxuXG4gIC5zcGFjZXIge1xuICAgIGZsZXg6IDE7XG4gIH1cblxuICAubG9hZGluZy1pbmRpY2F0b3Ige1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICB9XG5cbiAgLm5vdGlmaWNhdGlvbi1idG4sXG4gIC5sYW5ndWFnZS1idG4sXG4gIC51c2VyLW1lbnUtYnRuIHtcbiAgICBtYXJnaW4tbGVmdDogOHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgIC5tYXQtaWNvbiB7XG4gICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICB3aWR0aDogMjRweDtcbiAgICB9XG4gIH1cblxuICAubGFuZ3VhZ2UtYnRuIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA0cHg7XG5cbiAgICAubGFuZ3VhZ2UtaW5kaWNhdG9yIHtcbiAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYm90dG9tOiAycHg7XG4gICAgICByaWdodDogMnB4O1xuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjkpO1xuICAgICAgY29sb3I6ICMxOTc2ZDI7XG4gICAgICBwYWRkaW5nOiAxcHggM3B4O1xuICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgfVxuICB9XG59XG5cbi8vIFVzZXIgTWVudSBEcm9wZG93blxuLnVzZXItbWVudSB7XG4gIG1pbi13aWR0aDogMjQwcHg7XG5cbiAgLnVzZXItaW5mbyB7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1LCAxMTgsIDIxMCwgMC4wNSk7XG5cbiAgICAudXNlci1uYW1lIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gICAgfVxuXG4gICAgLnVzZXItcm9sZSB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBjb2xvcjogIzY2NjtcbiAgICAgIG1hcmdpbi1ib3R0b206IDJweDtcbiAgICB9XG5cbiAgICAudXNlci1lbWFpbCB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBjb2xvcjogIzk5OTtcbiAgICB9XG4gIH1cblxuICAubG9nb3V0LWJ0biB7XG4gICAgY29sb3I6ICNmNDQzMzY7XG5cbiAgICAubWF0LWljb24ge1xuICAgICAgY29sb3I6ICNmNDQzMzY7XG4gICAgfVxuICB9XG59XG5cbi8vIFNpZGVuYXYgQ29udGFpbmVyXG4uYXBwLXNpZGVuYXYtY29udGFpbmVyIHtcbiAgZmxleDogMTtcbiAgbWFyZ2luLXRvcDogNjRweDtcbn1cblxuLy8gU2lkZSBOYXZpZ2F0aW9uXG4uYXBwLXNpZGVuYXYge1xuICB3aWR0aDogMjgwcHg7XG4gIGJhY2tncm91bmQ6ICNmYWZhZmE7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICNlMGUwZTA7XG5cbiAgLm5hdmlnYXRpb24tbGlzdCB7XG4gICAgcGFkZGluZy10b3A6IDE2cHg7XG5cbiAgICAubmF2LWl0ZW0ge1xuICAgICAgbWFyZ2luOiA0cHggMTZweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBoZWlnaHQ6IDQ4cHg7XG5cbiAgICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1LCAxMTgsIDIxMCwgMC4wOCk7XG4gICAgICB9XG5cbiAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNSwgMTE4LCAyMTAsIDAuMTIpO1xuICAgICAgICBjb2xvcjogIzE5NzZkMjtcblxuICAgICAgICAubWF0LWljb24ge1xuICAgICAgICAgIGNvbG9yOiAjMTk3NmQyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICYuYWRtaW4taXRlbSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAxNTIsIDAsIDAuMSk7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDE1MiwgMCwgMC4yKTtcbiAgICAgICAgfVxuXG4gICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTUyLCAwLCAwLjMpO1xuICAgICAgICAgIGNvbG9yOiAjZmY5ODAwO1xuXG4gICAgICAgICAgLm1hdC1pY29uIHtcbiAgICAgICAgICAgIGNvbG9yOiAjZmY5ODAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAubWF0LWljb24ge1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG4gICAgICAgIGNvbG9yOiAjNjY2O1xuICAgICAgfVxuICAgIH1cblxuICAgIC5zZWN0aW9uLWhlYWRlciB7XG4gICAgICBjb2xvcjogIzY2NjtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgbWFyZ2luLXRvcDogMjRweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgICB9XG4gIH1cblxuICAuc2lkZW5hdi1mb290ZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3R0b206IDA7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICBwYWRkaW5nOiAxNnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2UwZTBlMDtcbiAgICBiYWNrZ3JvdW5kOiAjZjVmNWY1O1xuXG4gICAgLmFwcC12ZXJzaW9uIHtcbiAgICAgIGNvbG9yOiAjOTk5O1xuICAgIH1cbiAgfVxufVxuXG4vLyBNYWluIENvbnRlbnRcbi5tYWluLWNvbnRlbnQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6ICNmNWY1ZjU7XG4gIG1pbi1oZWlnaHQ6IGNhbGMoMTAwdmggLSA2NHB4KTtcbn1cblxuLnBhZ2UtY29udGVudCB7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIG1heC13aWR0aDogMTIwMHB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgbWluLWhlaWdodDogY2FsYygxMDB2aCAtIDExMnB4KTsgLy8gQWNjb3VudCBmb3IgdG9vbGJhciBhbmQgcGFkZGluZ1xufVxuXG4vLyBHbG9iYWwgTG9hZGluZyBPdmVybGF5XG4uZ2xvYmFsLWxvYWRpbmctb3ZlcmxheSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgei1pbmRleDogOTk5OTtcblxuICAubG9hZGluZy1jb250ZW50IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDE2cHg7XG5cbiAgICAubG9hZGluZy10ZXh0IHtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGNvbG9yOiAjNjY2O1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgIH1cbiAgfVxufVxuXG4vLyBMb2dpbiBMYXlvdXRcbi5sb2dpbi1sYXlvdXQge1xuICBmbGV4OiAxO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzE5NzZkMiAwJSwgIzQyYTVmNSAxMDAlKTtcbiAgbWluLWhlaWdodDogMTAwdmg7XG59XG5cbi8vIFBXQSBVcGRhdGUgTm90aWZpY2F0aW9uXG4ucHdhLXVwZGF0ZS1ub3RpZmljYXRpb24ge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGJvdHRvbTogMTZweDtcbiAgcmlnaHQ6IDE2cHg7XG4gIHotaW5kZXg6IDEwMDA7XG5cbiAgLnVwZGF0ZS1jYXJkIHtcbiAgICBtYXgtd2lkdGg6IDMyMHB4O1xuICAgIGJveC1zaGFkb3c6IDAgNHB4IDhweCByZ2JhKDAsMCwwLDAuMik7XG5cbiAgICAudXBkYXRlLW1lc3NhZ2Uge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBnYXA6IDEycHg7XG5cbiAgICAgIC5tYXQtaWNvbiB7XG4gICAgICAgIGNvbG9yOiAjNGNhZjUwO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBNb2JpbGUgUmVzcG9uc2l2ZVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5hcHAtdG9vbGJhciB7XG4gICAgcGFkZGluZzogMCAxMnB4O1xuXG4gICAgLmFwcC10aXRsZSB7XG4gICAgICAuYXBwLW5hbWUge1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLnBhZ2UtY29udGVudCB7XG4gICAgcGFkZGluZzogMTZweDtcbiAgfVxuXG4gIC5hcHAtc2lkZW5hdiB7XG4gICAgd2lkdGg6IDI4MHB4O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuICAuYXBwLXRvb2xiYXIge1xuICAgIGhlaWdodDogNTZweDtcblxuICAgIC5hcHAtdGl0bGUge1xuICAgICAgLmFwcC1uYW1lIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTsgLy8gSGlkZSBhcHAgbmFtZSBvbiB2ZXJ5IHNtYWxsIHNjcmVlbnNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuYXBwLXNpZGVuYXYtY29udGFpbmVyIHtcbiAgICBtYXJnaW4tdG9wOiA1NnB4O1xuICB9XG5cbiAgLnBhZ2UtY29udGVudCB7XG4gICAgcGFkZGluZzogMTJweDtcbiAgICBtaW4taGVpZ2h0OiBjYWxjKDEwMHZoIC0gODBweCk7XG4gIH1cbn1cblxuLy8gRGFyayB0aGVtZSBzdXBwb3J0IChmb3IgZnV0dXJlIGltcGxlbWVudGF0aW9uKVxuLmRhcmstdGhlbWUge1xuICAuYXBwLXNpZGVuYXYge1xuICAgIGJhY2tncm91bmQ6ICMzMDMwMzA7XG4gICAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjNDI0MjQyO1xuXG4gICAgLm5hdmlnYXRpb24tbGlzdCB7XG4gICAgICAubmF2LWl0ZW0ge1xuICAgICAgICBjb2xvcjogI2ZmZmZmZjtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJi5hY3RpdmUge1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjUsIDExOCwgMjEwLCAwLjIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLm1hdC1pY29uIHtcbiAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC5zaWRlbmF2LWZvb3RlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAjNDI0MjQyO1xuICAgICAgYm9yZGVyLXRvcC1jb2xvcjogIzU1NTU1NTtcbiAgICB9XG4gIH1cblxuICAubWFpbi1jb250ZW50IHtcbiAgICBiYWNrZ3JvdW5kOiAjMjEyMTIxO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICB9XG59XG5cbi8vIFByaW50IHN0eWxlc1xuQG1lZGlhIHByaW50IHtcbiAgLmFwcC10b29sYmFyLFxuICAuYXBwLXNpZGVuYXYsXG4gIC5nbG9iYWwtbG9hZGluZy1vdmVybGF5LFxuICAucHdhLXVwZGF0ZS1ub3RpZmljYXRpb24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxuXG4gIC5tYWluLWNvbnRlbnQge1xuICAgIG1hcmdpbi10b3A6IDAgIWltcG9ydGFudDtcbiAgfVxuXG4gIC5wYWdlLWNvbnRlbnQge1xuICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyBIaWdoIGNvbnRyYXN0IG1vZGUgc3VwcG9ydFxuQG1lZGlhIChwcmVmZXJzLWNvbnRyYXN0OiBoaWdoKSB7XG4gIC5hcHAtdG9vbGJhcixcbiAgLmFwcC1zaWRlbmF2IHtcbiAgICBib3JkZXI6IDJweCBzb2xpZDtcbiAgfVxuXG4gIC5uYXYtaXRlbSB7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG5cbiAgICAmLmFjdGl2ZSB7XG4gICAgICBib3JkZXItY29sb3I6ICMxOTc2ZDI7XG4gICAgfVxuICB9XG59XG5cbi8vIFJlZHVjZWQgbW90aW9uIHN1cHBvcnRcbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSB7XG4gICoge1xuICAgIHRyYW5zaXRpb246IG5vbmUgIWltcG9ydGFudDtcbiAgICBhbmltYXRpb246IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser/animations */ 3835);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_common_locales_en__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/locales/en */ 9032);
/* harmony import */ var _angular_common_locales_th__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/locales/th */ 4261);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/toolbar */ 9552);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/sidenav */ 7049);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/list */ 943);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/input */ 5541);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/form-field */ 4950);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/checkbox */ 7024);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/select */ 5175);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/datepicker */ 1977);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/core */ 4646);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/progress-spinner */ 1134);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/material/table */ 7697);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/paginator */ 4624);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/sort */ 2047);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/dialog */ 2587);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/tabs */ 8223);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/material/chips */ 2772);
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @angular/material/badge */ 6256);
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/material/stepper */ 6622);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @angular/material/expansion */ 9322);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @angular/material/progress-bar */ 6354);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @angular/material/slide-toggle */ 8827);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @angular/material/radio */ 3804);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! @angular/material/autocomplete */ 9771);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 5244);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var ngx_mask__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-mask */ 6769);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 4114);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 92);
/* harmony import */ var _core_interceptors_auth_interceptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/interceptors/auth.interceptor */ 3622);
/* harmony import */ var _core_interceptors_error_interceptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/interceptors/error.interceptor */ 9446);
/* harmony import */ var _core_interceptors_loading_interceptor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/interceptors/loading.interceptor */ 5196);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/shared.module */ 3887);








// Angular Material Modules































// NGX Mask for input formatting

// App Components and Modules


// Core Services and Interceptors



// Shared Module


// Register locales for i18n
(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.registerLocaleData)(_angular_common_locales_en__WEBPACK_IMPORTED_MODULE_7__["default"], 'en');
(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.registerLocaleData)(_angular_common_locales_th__WEBPACK_IMPORTED_MODULE_8__["default"], 'th');
class AppModule {
  constructor() {
    // Set default locale to Thai
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'th';
    }
  }
  static {
    this.ɵfac = function AppModule_Factory(t) {
      return new (t || AppModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({
      providers: [
      // NGX Mask Provider
      (0,ngx_mask__WEBPACK_IMPORTED_MODULE_10__.provideNgxMask)(),
      // Locale provider - will be set dynamically based on user preference
      {
        provide: _angular_core__WEBPACK_IMPORTED_MODULE_9__.LOCALE_ID,
        useValue: 'th-TH' // Default to Thai locale
      },
      // HTTP Interceptors
      {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_11__.HTTP_INTERCEPTORS,
        useClass: _core_interceptors_auth_interceptor__WEBPACK_IMPORTED_MODULE_2__.AuthInterceptor,
        multi: true
      }, {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_11__.HTTP_INTERCEPTORS,
        useClass: _core_interceptors_error_interceptor__WEBPACK_IMPORTED_MODULE_3__.ErrorInterceptor,
        multi: true
      }, {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_11__.HTTP_INTERCEPTORS,
        useClass: _core_interceptors_loading_interceptor__WEBPACK_IMPORTED_MODULE_4__.LoadingInterceptor,
        multi: true
      }],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__.BrowserAnimationsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_11__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule,
      // Angular Material Modules
      _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_15__.MatToolbarModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__.MatSidenavModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIconModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_19__.MatListModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_20__.MatCardModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_22__.MatFormFieldModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_23__.MatCheckboxModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_24__.MatSelectModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_25__.MatDatepickerModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__.MatNativeDateModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_28__.MatSnackBarModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_32__.MatDialogModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_34__.MatTabsModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_35__.MatChipsModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_36__.MatBadgeModule, _angular_material_stepper__WEBPACK_IMPORTED_MODULE_37__.MatStepperModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_38__.MatExpansionModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_39__.MatProgressBarModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_40__.MatSlideToggleModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_41__.MatRadioModule, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_42__.MatAutocompleteModule, _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_43__.MatBottomSheetModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__.MatRippleModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_44__.MatDividerModule,
      // App Modules
      _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__.SharedModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__.BrowserAnimationsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_11__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule,
    // Angular Material Modules
    _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_15__.MatToolbarModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_16__.MatSidenavModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIconModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_19__.MatListModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_20__.MatCardModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_22__.MatFormFieldModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_23__.MatCheckboxModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_24__.MatSelectModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_25__.MatDatepickerModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__.MatNativeDateModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_28__.MatSnackBarModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_32__.MatDialogModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_34__.MatTabsModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_35__.MatChipsModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_36__.MatBadgeModule, _angular_material_stepper__WEBPACK_IMPORTED_MODULE_37__.MatStepperModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_38__.MatExpansionModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_39__.MatProgressBarModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_40__.MatSlideToggleModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_41__.MatRadioModule, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_42__.MatAutocompleteModule, _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_43__.MatBottomSheetModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__.MatRippleModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_44__.MatDividerModule,
    // NGX Mask Directives
    ngx_mask__WEBPACK_IMPORTED_MODULE_10__.NgxMaskDirective, ngx_mask__WEBPACK_IMPORTED_MODULE_10__.NgxMaskPipe,
    // App Modules
    _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__.SharedModule]
  });
})();

/***/ }),

/***/ 4978:
/*!*******************************************!*\
  !*** ./src/app/core/guards/auth.guard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthGuard: () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 4334);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);




class AuthGuard {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate(route, state) {
    return this.checkAuth(state.url);
  }
  canActivateChild(childRoute, state) {
    return this.checkAuth(state.url);
  }
  checkAuth(url) {
    return this.authService.currentUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(user => {
      if (user) {
        return true;
      } else {
        // Store the attempted URL for redirecting after login
        this.router.navigate(['/auth/login'], {
          queryParams: {
            returnUrl: url
          }
        });
        return false;
      }
    }));
  }
  static {
    this.ɵfac = function AuthGuard_Factory(t) {
      return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: AuthGuard,
      factory: AuthGuard.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 400:
/*!*******************************************!*\
  !*** ./src/app/core/guards/role.guard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RoleGuard: () => (/* binding */ RoleGuard)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 4334);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _services_notification_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/notification.service */ 5567);





class RoleGuard {
  constructor(authService, router, notificationService) {
    this.authService = authService;
    this.router = router;
    this.notificationService = notificationService;
  }
  canActivate(route, state) {
    return this.checkRole(route);
  }
  checkRole(route) {
    return this.authService.currentUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(user => {
      if (!user) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      const requiredRoles = route.data['roles'];
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // No role requirement
      }
      const hasRequiredRole = this.authService.canAccessRoute(requiredRoles);
      if (!hasRequiredRole) {
        this.notificationService.showError('คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ / You don\'t have permission to access this page');
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }));
  }
  static {
    this.ɵfac = function RoleGuard_Factory(t) {
      return new (t || RoleGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_services_notification_service__WEBPACK_IMPORTED_MODULE_1__.NotificationService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: RoleGuard,
      factory: RoleGuard.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 3622:
/*!*******************************************************!*\
  !*** ./src/app/core/interceptors/auth.interceptor.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthInterceptor: () => (/* binding */ AuthInterceptor)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 7919);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 9400);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 1318);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 6647);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 9475);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 1567);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 4334);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 5072);





class AuthInterceptor {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
    this.isRefreshing = false;
    this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(null);
  }
  intercept(req, next) {
    // Skip token attachment for authentication endpoints
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }
    const token = this.authService.getToken();
    // Add auth header if token exists
    if (token) {
      req = this.addTokenToRequest(req, token);
    }
    return next.handle(req).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.catchError)(error => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && token && !this.isAuthEndpoint(req.url)) {
        return this.handle401Error(req, next);
      }
      // Handle other errors
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.throwError)(() => error);
    }));
  }
  handle401Error(req, next) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = this.authService.getRefreshToken();
      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.switchMap)(response => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.token);
          // Retry the failed request with new token
          return next.handle(this.addTokenToRequest(req, response.token));
        }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.catchError)(error => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.throwError)(() => error);
        }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.finalize)(() => {
          this.isRefreshing = false;
        }));
      } else {
        // No refresh token available
        this.isRefreshing = false;
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return rxjs__WEBPACK_IMPORTED_MODULE_6__.EMPTY;
      }
    } else {
      // Token refresh is already in progress
      return this.refreshTokenSubject.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(token => token !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.switchMap)(token => next.handle(this.addTokenToRequest(req, token))));
    }
  }
  addTokenToRequest(req, token) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  isAuthEndpoint(url) {
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }
  static {
    this.ɵfac = function AuthInterceptor_Factory(t) {
      return new (t || AuthInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjectable"]({
      token: AuthInterceptor,
      factory: AuthInterceptor.ɵfac
    });
  }
}

/***/ }),

/***/ 9446:
/*!********************************************************!*\
  !*** ./src/app/core/interceptors/error.interceptor.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorInterceptor: () => (/* binding */ ErrorInterceptor)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 7919);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 1995);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 1318);
/* harmony import */ var _services_notification_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/notification.service */ 5567);
/* harmony import */ var _services_translation_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/translation.service */ 2243);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _models_common_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/common.model */ 3101);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 7580);







class ErrorInterceptor {
  constructor(injector) {
    this.injector = injector;
  }
  intercept(req, next) {
    return next.handle(req).pipe(
    // Retry failed requests (except for certain error types)
    (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.retry)({
      count: this.shouldRetry(req) ? _environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.api.retryAttempts : 0,
      delay: (error, retryCount) => {
        // Exponential backoff
        return new Promise(resolve => {
          setTimeout(resolve, _environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.api.retryDelay * Math.pow(2, retryCount - 1));
        });
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      const appError = this.createAppError(error, req);
      // Log error in development
      if (!_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.production) {
        console.error('HTTP Error:', appError);
      }
      // Show user-friendly error message
      this.handleUserNotification(appError);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => appError);
    }));
  }
  shouldRetry(req) {
    // Don't retry for certain methods and endpoints
    const nonRetryableMethods = ['POST', 'PUT', 'DELETE'];
    const nonRetryableEndpoints = ['/auth/login', '/auth/register'];
    return !nonRetryableMethods.includes(req.method.toUpperCase()) && !nonRetryableEndpoints.some(endpoint => req.url.includes(endpoint));
  }
  createAppError(error, req) {
    let appError = {
      code: _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.SERVER_ERROR,
      message: 'An unexpected error occurred',
      messageThai: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
      timestamp: new Date(),
      path: req.url,
      method: req.method,
      statusCode: error.status
    };
    if (error.error && typeof error.error === 'object') {
      // Server returned structured error response
      appError = {
        ...appError,
        code: error.error.code || this.getErrorCodeFromStatus(error.status),
        message: error.error.message || appError.message,
        messageThai: error.error.messageThai || appError.messageThai,
        details: error.error.errors || error.error.details
      };
    } else {
      // Handle different error types
      switch (error.status) {
        case 0:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.NETWORK_ERROR;
          appError.message = 'Network connection error';
          appError.messageThai = 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย';
          break;
        case 400:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.VALIDATION_ERROR;
          appError.message = 'Invalid request data';
          appError.messageThai = 'ข้อมูลที่ส่งมาไม่ถูกต้อง';
          break;
        case 401:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.UNAUTHORIZED;
          appError.message = 'Authentication required';
          appError.messageThai = 'จำเป็นต้องเข้าสู่ระบบ';
          break;
        case 403:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.FORBIDDEN;
          appError.message = 'Access denied';
          appError.messageThai = 'ไม่มีสิทธิ์ในการเข้าถึง';
          break;
        case 404:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.NOT_FOUND;
          appError.message = 'Resource not found';
          appError.messageThai = 'ไม่พบข้อมูลที่ต้องการ';
          break;
        case 409:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.CONFLICT;
          appError.message = 'Resource conflict';
          appError.messageThai = 'ข้อมูลขัดแย้ง';
          break;
        case 422:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.BUSINESS_RULE_VIOLATION;
          appError.message = 'Business rule violation';
          appError.messageThai = 'ข้อมูลไม่เป็นไปตามกฎเกณฑ์ทางธุรกิจ';
          break;
        case 408:
        case 504:
          appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.TIMEOUT_ERROR;
          appError.message = 'Request timeout';
          appError.messageThai = 'การร้องขอหมดเวลา';
          break;
        default:
          if (error.status >= 500) {
            appError.code = _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.SERVER_ERROR;
            appError.message = 'Server error';
            appError.messageThai = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
          }
      }
    }
    return appError;
  }
  getErrorCodeFromStatus(status) {
    switch (status) {
      case 400:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.VALIDATION_ERROR;
      case 401:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.UNAUTHORIZED;
      case 403:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.FORBIDDEN;
      case 404:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.NOT_FOUND;
      case 409:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.CONFLICT;
      case 422:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.BUSINESS_RULE_VIOLATION;
      case 408:
      case 504:
        return _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.TIMEOUT_ERROR;
      default:
        return status >= 500 ? _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.SERVER_ERROR : _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.VALIDATION_ERROR;
    }
  }
  handleUserNotification(error) {
    // Don't show notifications for certain error types
    const silentErrors = [_models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.UNAUTHORIZED];
    if (silentErrors.includes(error.code)) {
      return;
    }
    try {
      // Get services lazily to avoid circular dependency
      const notificationService = this.injector.get(_services_notification_service__WEBPACK_IMPORTED_MODULE_0__.NotificationService);
      const translationService = this.injector.get(_services_translation_service__WEBPACK_IMPORTED_MODULE_1__.TranslationService);
      // Show different notification types based on error severity
      const isCurrentLanguageThai = translationService.currentLanguage === 'th';
      const message = isCurrentLanguageThai && error.messageThai ? error.messageThai : error.message;
      switch (error.code) {
        case _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.NETWORK_ERROR:
        case _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.TIMEOUT_ERROR:
          notificationService.showError(message, {
            duration: 5000,
            action: 'Retry'
          });
          break;
        case _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.VALIDATION_ERROR:
          notificationService.showWarning(message, {
            duration: 4000
          });
          break;
        case _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.FORBIDDEN:
        case _models_common_model__WEBPACK_IMPORTED_MODULE_3__.ErrorCode.NOT_FOUND:
          notificationService.showInfo(message, {
            duration: 3000
          });
          break;
        default:
          notificationService.showError(message, {
            duration: 4000
          });
      }
    } catch (injectionError) {
      // Fallback if services are not available
      console.error('Error notification failed:', error.message, injectionError);
    }
  }
  static {
    this.ɵfac = function ErrorInterceptor_Factory(t) {
      return new (t || ErrorInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.Injector));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
      token: ErrorInterceptor,
      factory: ErrorInterceptor.ɵfac
    });
  }
}

/***/ }),

/***/ 5196:
/*!**********************************************************!*\
  !*** ./src/app/core/interceptors/loading.interceptor.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadingInterceptor: () => (/* binding */ LoadingInterceptor)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 9475);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_loading_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/loading.service */ 8660);



class LoadingInterceptor {
  constructor(loadingService) {
    this.loadingService = loadingService;
  }
  intercept(req, next) {
    // Skip loading indicator for certain requests
    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }
    // Generate unique loading key based on request
    const loadingKey = this.generateLoadingKey(req);
    // Start loading
    this.loadingService.setLoading(loadingKey, true);
    return next.handle(req).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.finalize)(() => {
      // Stop loading when request completes (success or error)
      this.loadingService.setLoading(loadingKey, false);
    }));
  }
  shouldSkipLoading(req) {
    // Skip loading for certain requests to avoid UI flickering
    const skipLoadingEndpoints = ['/auth/refresh-token', '/notifications/count', '/heartbeat', '/health'];
    // Skip if request has custom header to disable loading
    if (req.headers.has('X-Skip-Loading')) {
      return true;
    }
    // Skip for specific endpoints
    return skipLoadingEndpoints.some(endpoint => req.url.includes(endpoint));
  }
  generateLoadingKey(req) {
    // Create a unique key for the request
    // This allows tracking multiple concurrent requests independently
    const method = req.method;
    const url = req.url.replace(/\/\d+/g, '/:id'); // Replace IDs with placeholder
    return `${method}:${url}`;
  }
  static {
    this.ɵfac = function LoadingInterceptor_Factory(t) {
      return new (t || LoadingInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_services_loading_service__WEBPACK_IMPORTED_MODULE_0__.LoadingService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: LoadingInterceptor,
      factory: LoadingInterceptor.ɵfac
    });
  }
}

/***/ }),

/***/ 3101:
/*!*********************************************!*\
  !*** ./src/app/core/models/common.model.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuditAction: () => (/* binding */ AuditAction),
/* harmony export */   ConfigDataType: () => (/* binding */ ConfigDataType),
/* harmony export */   DocumentStatus: () => (/* binding */ DocumentStatus),
/* harmony export */   ErrorCode: () => (/* binding */ ErrorCode),
/* harmony export */   FilterOperator: () => (/* binding */ FilterOperator),
/* harmony export */   NotificationPriority: () => (/* binding */ NotificationPriority),
/* harmony export */   NotificationType: () => (/* binding */ NotificationType),
/* harmony export */   ThaiRegion: () => (/* binding */ ThaiRegion),
/* harmony export */   ValidationType: () => (/* binding */ ValidationType)
/* harmony export */ });
var FilterOperator;
(function (FilterOperator) {
  FilterOperator["EQUALS"] = "EQUALS";
  FilterOperator["NOT_EQUALS"] = "NOT_EQUALS";
  FilterOperator["GREATER_THAN"] = "GREATER_THAN";
  FilterOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
  FilterOperator["LESS_THAN"] = "LESS_THAN";
  FilterOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
  FilterOperator["LIKE"] = "LIKE";
  FilterOperator["NOT_LIKE"] = "NOT_LIKE";
  FilterOperator["IN"] = "IN";
  FilterOperator["NOT_IN"] = "NOT_IN";
  FilterOperator["IS_NULL"] = "IS_NULL";
  FilterOperator["IS_NOT_NULL"] = "IS_NOT_NULL";
  FilterOperator["BETWEEN"] = "BETWEEN";
  FilterOperator["STARTS_WITH"] = "STARTS_WITH";
  FilterOperator["ENDS_WITH"] = "ENDS_WITH";
  FilterOperator["CONTAINS"] = "CONTAINS";
})(FilterOperator || (FilterOperator = {}));
// Document Status enum - shared between models
var DocumentStatus;
(function (DocumentStatus) {
  DocumentStatus["PENDING"] = "PENDING";
  DocumentStatus["APPROVED"] = "APPROVED";
  DocumentStatus["REJECTED"] = "REJECTED";
  DocumentStatus["EXPIRED"] = "EXPIRED";
})(DocumentStatus || (DocumentStatus = {}));
var NotificationType;
(function (NotificationType) {
  NotificationType["POLICY_REMINDER"] = "POLICY_REMINDER";
  NotificationType["POLICY_RENEWAL"] = "POLICY_RENEWAL";
  NotificationType["POLICY_EXPIRY"] = "POLICY_EXPIRY";
  NotificationType["CLAIM_UPDATE"] = "CLAIM_UPDATE";
  NotificationType["CLAIM_APPROVED"] = "CLAIM_APPROVED";
  NotificationType["CLAIM_REJECTED"] = "CLAIM_REJECTED";
  NotificationType["PAYMENT_DUE"] = "PAYMENT_DUE";
  NotificationType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
  NotificationType["SYSTEM_MAINTENANCE"] = "SYSTEM_MAINTENANCE";
  NotificationType["PROMOTIONAL"] = "PROMOTIONAL";
  NotificationType["ACCOUNT_UPDATE"] = "ACCOUNT_UPDATE";
})(NotificationType || (NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
  NotificationPriority["LOW"] = "LOW";
  NotificationPriority["MEDIUM"] = "MEDIUM";
  NotificationPriority["HIGH"] = "HIGH";
  NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (NotificationPriority = {}));
var ThaiRegion;
(function (ThaiRegion) {
  ThaiRegion["NORTHERN"] = "NORTHERN";
  ThaiRegion["NORTHEASTERN"] = "NORTHEASTERN";
  ThaiRegion["CENTRAL"] = "CENTRAL";
  ThaiRegion["EASTERN"] = "EASTERN";
  ThaiRegion["WESTERN"] = "WESTERN";
  ThaiRegion["SOUTHERN"] = "SOUTHERN";
})(ThaiRegion || (ThaiRegion = {}));
var AuditAction;
(function (AuditAction) {
  AuditAction["CREATE"] = "CREATE";
  AuditAction["UPDATE"] = "UPDATE";
  AuditAction["DELETE"] = "DELETE";
  AuditAction["LOGIN"] = "LOGIN";
  AuditAction["LOGOUT"] = "LOGOUT";
  AuditAction["VIEW"] = "VIEW";
  AuditAction["EXPORT"] = "EXPORT";
  AuditAction["APPROVE"] = "APPROVE";
  AuditAction["REJECT"] = "REJECT";
})(AuditAction || (AuditAction = {}));
var ConfigDataType;
(function (ConfigDataType) {
  ConfigDataType["STRING"] = "STRING";
  ConfigDataType["INTEGER"] = "INTEGER";
  ConfigDataType["DECIMAL"] = "DECIMAL";
  ConfigDataType["BOOLEAN"] = "BOOLEAN";
  ConfigDataType["DATE"] = "DATE";
  ConfigDataType["JSON"] = "JSON";
})(ConfigDataType || (ConfigDataType = {}));
var ValidationType;
(function (ValidationType) {
  ValidationType["REQUIRED"] = "REQUIRED";
  ValidationType["MIN_LENGTH"] = "MIN_LENGTH";
  ValidationType["MAX_LENGTH"] = "MAX_LENGTH";
  ValidationType["MIN_VALUE"] = "MIN_VALUE";
  ValidationType["MAX_VALUE"] = "MAX_VALUE";
  ValidationType["PATTERN"] = "PATTERN";
  ValidationType["EMAIL"] = "EMAIL";
  ValidationType["URL"] = "URL";
})(ValidationType || (ValidationType = {}));
var ErrorCode;
(function (ErrorCode) {
  ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
  ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
  ErrorCode["FORBIDDEN"] = "FORBIDDEN";
  ErrorCode["NOT_FOUND"] = "NOT_FOUND";
  ErrorCode["CONFLICT"] = "CONFLICT";
  ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
  ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
  ErrorCode["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
  ErrorCode["BUSINESS_RULE_VIOLATION"] = "BUSINESS_RULE_VIOLATION";
})(ErrorCode || (ErrorCode = {}));

/***/ }),

/***/ 8010:
/*!***********************************************!*\
  !*** ./src/app/core/services/auth.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 7919);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 4876);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 8764);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 1318);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 5072);






class AuthService {
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/auth`;
    this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    // Initialize user from localStorage if available
    this.initializeFromStorage();
  }
  // Public getters
  get currentUser() {
    return this.currentUserSubject.value;
  }
  get isAuthenticated() {
    return !!this.getToken() && !!this.currentUser;
  }
  get isAdmin() {
    return this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'SUPER_ADMIN';
  }
  get userRole() {
    return this.currentUser?.role || null;
  }
  // Authentication methods
  login(credentials) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }
      return response.data;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(loginResponse => {
      this.setSession(loginResponse);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Login error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  register(userData) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }
      return response.data;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Registration error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  logout() {
    this.clearSession();
    this.currentUserSubject.next(null);
    this.clearTokenExpirationTimer();
    this.router.navigate(['/auth/login']);
  }
  refreshToken(refreshToken) {
    const request = {
      refreshToken
    };
    return this.http.post(`${this.apiUrl}/refresh-token`, request).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token refresh failed');
      }
      return response.data;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(loginResponse => {
      this.setSession(loginResponse);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Token refresh error:', error);
      this.logout();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  forgotPassword(email) {
    const request = {
      email
    };
    return this.http.post(`${this.apiUrl}/forgot-password`, request).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Forgot password error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  resetPassword(token, newPassword) {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Reset password error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  changePassword(request) {
    return this.http.post(`${this.apiUrl}/change-password`, request).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Change password error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  verifyEmail(token) {
    return this.http.post(`${this.apiUrl}/verify-email`, {
      token
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Email verification error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  resendVerificationEmail() {
    return this.http.post(`${this.apiUrl}/resend-verification`, {}).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Resend verification failed');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Resend verification error:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  // Token management
  getToken() {
    return localStorage.getItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey);
  }
  getRefreshToken() {
    return localStorage.getItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_refresh`);
  }
  // Session management
  setSession(loginResponse) {
    const {
      user,
      token,
      refreshToken,
      expiresAt
    } = loginResponse;
    // Store tokens
    localStorage.setItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey, token);
    localStorage.setItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_refresh`, refreshToken);
    localStorage.setItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.userKey, JSON.stringify(user));
    localStorage.setItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_expires`, expiresAt.toString());
    // Update current user
    this.currentUserSubject.next(user);
    // Set token expiration timer
    this.setTokenExpirationTimer(expiresAt);
  }
  clearSession() {
    localStorage.removeItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey);
    localStorage.removeItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_refresh`);
    localStorage.removeItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.userKey);
    localStorage.removeItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_expires`);
  }
  initializeFromStorage() {
    try {
      const userJson = localStorage.getItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.userKey);
      const token = this.getToken();
      const expiresAtStr = localStorage.getItem(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.tokenKey}_expires`);
      if (userJson && token && expiresAtStr) {
        const user = JSON.parse(userJson);
        const expiresAt = new Date(expiresAtStr);
        // Check if token is still valid
        if (expiresAt > new Date()) {
          this.currentUserSubject.next(user);
          this.setTokenExpirationTimer(expiresAt);
        } else {
          // Token expired, try to refresh
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            this.refreshToken(refreshToken).subscribe({
              error: () => this.clearSession()
            });
          } else {
            this.clearSession();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearSession();
    }
  }
  setTokenExpirationTimer(expirationDate) {
    this.clearTokenExpirationTimer();
    const expiresInMs = expirationDate.getTime() - new Date().getTime();
    if (expiresInMs > 0) {
      // Set timer to refresh token 5 minutes before expiration
      const refreshTime = Math.max(expiresInMs - 5 * 60 * 1000, 60000); // At least 1 minute
      this.tokenExpirationTimer = (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.timer)(refreshTime).subscribe(() => {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          this.refreshToken(refreshToken).subscribe({
            error: () => this.logout()
          });
        } else {
          this.logout();
        }
      });
    }
  }
  clearTokenExpirationTimer() {
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
      this.tokenExpirationTimer = undefined;
    }
  }
  // Utility methods
  hasPermission(permission) {
    if (!this.currentUser) {
      return false;
    }
    // Super admin has all permissions
    if (this.currentUser.role === 'SUPER_ADMIN') {
      return true;
    }
    // Add specific permission logic based on roles
    switch (permission) {
      case 'VIEW_ALL_POLICIES':
      case 'VIEW_ALL_CLAIMS':
      case 'MANAGE_USERS':
        return this.currentUser.role === 'ADMIN';
      case 'CREATE_POLICY':
      case 'VIEW_OWN_POLICIES':
      case 'CREATE_CLAIM':
      case 'VIEW_OWN_CLAIMS':
        return true;
      // All authenticated users
      default:
        return false;
    }
  }
  canAccessRoute(requiredRoles) {
    if (!this.currentUser) {
      return false;
    }
    return requiredRoles.includes(this.currentUser.role);
  }
  static {
    this.ɵfac = function AuthService_Factory(t) {
      return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_9__.Router));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
      token: AuthService,
      factory: AuthService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8660:
/*!**************************************************!*\
  !*** ./src/app/core/services/loading.service.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadingService: () => (/* binding */ LoadingService)
/* harmony export */ });
/* harmony import */ var _Users_mvvkiran_Workspace_Angular_auto_insurance_app_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);




class LoadingService {
  constructor() {
    this.loadingSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject({});
    /**
     * Observable that emits the current loading state
     */
    this.loading$ = this.loadingSubject.asObservable();
    /**
     * Observable that emits true if any loading operation is active
     */
    this.isLoading$ = this.loading$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(loadingStates => Object.values(loadingStates).some(isLoading => isLoading)));
  }
  /**
   * Set loading state for a specific key
   * @param key - Unique identifier for the loading operation
   * @param isLoading - Loading state
   */
  setLoading(key, isLoading) {
    const currentState = this.loadingSubject.value;
    if (isLoading) {
      this.loadingSubject.next({
        ...currentState,
        [key]: true
      });
    } else {
      const {
        [key]: removed,
        ...newState
      } = currentState;
      this.loadingSubject.next(newState);
    }
  }
  /**
   * Get loading state for a specific key
   * @param key - Unique identifier for the loading operation
   */
  isLoading(key) {
    return this.loading$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(loadingStates => !!loadingStates[key]));
  }
  /**
   * Get current loading state for a specific key (synchronous)
   * @param key - Unique identifier for the loading operation
   */
  isLoadingSync(key) {
    const currentState = this.loadingSubject.value;
    return !!currentState[key];
  }
  /**
   * Clear all loading states
   */
  clearAll() {
    this.loadingSubject.next({});
  }
  /**
   * Get all currently active loading keys
   */
  getActiveLoadingKeys() {
    const currentState = this.loadingSubject.value;
    return Object.keys(currentState).filter(key => currentState[key]);
  }
  /**
   * Show loading for a specific operation with automatic cleanup
   * @param key - Unique identifier for the loading operation
   * @param operation - Promise or Observable to track
   */
  trackOperation(key, operation) {
    var _this = this;
    return (0,_Users_mvvkiran_Workspace_Angular_auto_insurance_app_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.setLoading(key, true);
      try {
        if (operation instanceof Promise) {
          const result = yield operation;
          return result;
        } else {
          // Handle Observable
          return new Promise((resolve, reject) => {
            operation.subscribe({
              next: value => resolve(value),
              error: error => reject(error),
              complete: () => {} // Value should be emitted in next
            });
          });
        }
      } finally {
        _this.setLoading(key, false);
      }
    })();
  }
  /**
   * Show loading with a minimum display time to prevent flickering
   * @param key - Unique identifier for the loading operation
   * @param operation - Promise or Observable to track
   * @param minDuration - Minimum time to show loading (in milliseconds)
   */
  trackOperationWithMinDuration(_x, _x2) {
    var _this2 = this;
    return (0,_Users_mvvkiran_Workspace_Angular_auto_insurance_app_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (key, operation, minDuration = 500) {
      _this2.setLoading(key, true);
      const startTime = Date.now();
      try {
        let result;
        if (operation instanceof Promise) {
          result = yield operation;
        } else {
          // Handle Observable
          result = yield new Promise((resolve, reject) => {
            operation.subscribe({
              next: value => resolve(value),
              error: error => reject(error)
            });
          });
        }
        // Ensure minimum duration
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minDuration) {
          yield new Promise(resolve => setTimeout(resolve, minDuration - elapsedTime));
        }
        return result;
      } finally {
        _this2.setLoading(key, false);
      }
    }).apply(this, arguments);
  }
  /**
   * Show global loading overlay
   */
  showGlobalLoading() {
    this.setLoading('GLOBAL', true);
  }
  /**
   * Hide global loading overlay
   */
  hideGlobalLoading() {
    this.setLoading('GLOBAL', false);
  }
  /**
   * Check if global loading is active
   */
  isGlobalLoading() {
    return this.isLoading('GLOBAL');
  }
  /**
   * Show page loading
   */
  showPageLoading(page) {
    this.setLoading(`PAGE_${page}`, true);
  }
  /**
   * Hide page loading
   */
  hidePageLoading(page) {
    this.setLoading(`PAGE_${page}`, false);
  }
  /**
   * Check if specific page is loading
   */
  isPageLoading(page) {
    return this.isLoading(`PAGE_${page}`);
  }
  static {
    this.ɵfac = function LoadingService_Factory(t) {
      return new (t || LoadingService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: LoadingService,
      factory: LoadingService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 5567:
/*!*******************************************************!*\
  !*** ./src/app/core/services/notification.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationService: () => (/* binding */ NotificationService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 8764);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 6443);







class NotificationService {
  constructor(snackBar, http) {
    this.snackBar = snackBar;
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/notifications`;
    this.unreadCountSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(0);
    this.unreadCount$ = this.unreadCountSubject.asObservable();
    // Don't load unread count during initialization to avoid circular dependency
    // It will be loaded when needed
  }
  // Toast notifications
  showSuccess(message, options) {
    return this.showNotification(message, 'success', options);
  }
  showError(message, options) {
    return this.showNotification(message, 'error', options);
  }
  showWarning(message, options) {
    return this.showNotification(message, 'warning', options);
  }
  showInfo(message, options) {
    return this.showNotification(message, 'info', options);
  }
  showNotification(message, type, options) {
    const config = {
      duration: this.getDefaultDuration(type),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`, 'custom-snackbar'],
      ...options
    };
    return this.snackBar.open(message, options?.action || 'ปิด', config);
  }
  getDefaultDuration(type) {
    switch (type) {
      case 'success':
        return 3000;
      case 'error':
        return 5000;
      case 'warning':
        return 4000;
      case 'info':
        return 3000;
      default:
        return 3000;
    }
  }
  // Server-side notifications
  getNotifications(searchRequest) {
    return this.http.post(`${this.apiUrl}/search`, searchRequest).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load notifications');
      }
      return response.data;
    }));
  }
  getUnreadNotifications() {
    return this.http.get(`${this.apiUrl}/unread`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load unread notifications');
      }
      return response.data;
    }));
  }
  markAsRead(notificationId) {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark notification as read');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(() => {
      // Update unread count
      this.updateUnreadCount(-1);
    }));
  }
  markAllAsRead() {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {}).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark all notifications as read');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(() => {
      // Reset unread count
      this.unreadCountSubject.next(0);
    }));
  }
  deleteNotification(notificationId) {
    return this.http.delete(`${this.apiUrl}/${notificationId}`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete notification');
      }
    }));
  }
  getUnreadCount() {
    return this.http.get(`${this.apiUrl}/unread-count`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load unread count');
      }
      return response.data.count;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(count => {
      this.unreadCountSubject.next(count);
    }));
  }
  loadUnreadCount() {
    this.getUnreadCount().subscribe({
      error: error => {
        console.error('Failed to load unread notification count:', error);
      }
    });
  }
  updateUnreadCount(delta) {
    const currentCount = this.unreadCountSubject.value;
    const newCount = Math.max(0, currentCount + delta);
    this.unreadCountSubject.next(newCount);
  }
  // Utility methods for common notification scenarios
  showSaveSuccess() {
    return this.showSuccess('บันทึกข้อมูลเรียบร้อยแล้ว / Data saved successfully');
  }
  showDeleteSuccess() {
    return this.showSuccess('ลบข้อมูลเรียบร้อยแล้ว / Data deleted successfully');
  }
  showUpdateSuccess() {
    return this.showSuccess('อัปเดตข้อมูลเรียบร้อยแล้ว / Data updated successfully');
  }
  showValidationError(message) {
    return this.showError(message || 'กรุณาตรวจสอบข้อมูลที่กรอก / Please check the entered data');
  }
  showNetworkError() {
    return this.showError('เกิดข้อผิดพลาดในการเชื่อมต่อ / Network connection error', {
      action: 'ลองใหม่ / Retry',
      duration: 0 // Don't auto-dismiss
    });
  }
  showUnauthorizedError() {
    return this.showError('กรุณาเข้าสู่ระบบใหม่ / Please login again', {
      action: 'เข้าสู่ระบบ / Login'
    });
  }
  showMaintenanceNotice() {
    return this.showInfo('ระบบอยู่ในช่วงการบำรุงรักษา / System under maintenance', {
      duration: 0,
      action: 'ตกลง / OK'
    });
  }
  // Policy-specific notifications
  showPolicyCreated() {
    return this.showSuccess('สร้างกรมธรรม์เรียบร้อยแล้ว / Policy created successfully');
  }
  showPolicyUpdated() {
    return this.showSuccess('อัปเดตกรมธรรม์เรียบร้อยแล้ว / Policy updated successfully');
  }
  showClaimSubmitted() {
    return this.showSuccess('ยื่นเรื่องเคลมเรียบร้อยแล้ว / Claim submitted successfully');
  }
  showDocumentUploaded() {
    return this.showSuccess('อัปโหลดเอกสารเรียบร้อยแล้ว / Document uploaded successfully');
  }
  showPaymentProcessed() {
    return this.showSuccess('ดำเนินการชำระเงินเรียบร้อยแล้ว / Payment processed successfully');
  }
  static {
    this.ɵfac = function NotificationService_Factory(t) {
      return new (t || NotificationService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: NotificationService,
      factory: NotificationService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 2243:
/*!******************************************************!*\
  !*** ./src/app/core/services/translation.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TranslationService: () => (/* binding */ TranslationService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 9452);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 8764);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 1318);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 6443);





class TranslationService {
  constructor(http) {
    this.http = http;
    this.currentLanguageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject('th');
    this.translations = new Map();
    this.loadingTranslations = new Set();
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
    this.initializeLanguage();
  }
  get currentLanguage() {
    return this.currentLanguageSubject.value;
  }
  /**
   * Set the current language and load translations if not already loaded
   */
  setLanguage(language) {
    if (language === this.currentLanguage) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.of)(this.translations.get(language) || {});
    }
    return this.loadTranslations(language).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(() => {
      this.currentLanguageSubject.next(language);
      this.saveLanguagePreference(language);
      this.updateDocumentLanguage(language);
    }));
  }
  /**
   * Get translation for a key
   */
  translate(key, params) {
    const currentTranslations = this.translations.get(this.currentLanguage) || {};
    let translation = this.getNestedValue(currentTranslations, key);
    if (!translation) {
      // Fallback to English if Thai translation not found
      if (this.currentLanguage === 'th') {
        const englishTranslations = this.translations.get('en') || {};
        translation = this.getNestedValue(englishTranslations, key);
      }
      // If still not found, return the key itself
      if (!translation) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }
    // Replace parameters in translation
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        const placeholder = new RegExp(`{{\\s*${param}\\s*}}`, 'g');
        translation = translation.replace(placeholder, params[param]);
      });
    }
    return translation;
  }
  /**
   * Get translation as observable (useful for templates)
   */
  get(key, params) {
    return this.currentLanguage$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(() => this.translate(key, params)));
  }
  /**
   * Get instant translation (synchronous)
   */
  instant(key, params) {
    return this.translate(key, params);
  }
  /**
   * Load translations for a specific language
   */
  loadTranslations(language) {
    // Avoid duplicate loading
    if (this.loadingTranslations.has(language)) {
      return new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.translations.get(language) || {}).asObservable();
    }
    // Return cached translations if available
    if (this.translations.has(language)) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.of)(this.translations.get(language));
    }
    this.loadingTranslations.add(language);
    return this.http.get(`/assets/i18n/${language}.json`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(translations => {
      this.translations.set(language, translations);
      this.loadingTranslations.delete(language);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      console.error(`Failed to load translations for ${language}:`, error);
      this.loadingTranslations.delete(language);
      // Return empty object as fallback
      const fallbackTranslations = {};
      this.translations.set(language, fallbackTranslations);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.of)(fallbackTranslations);
    }));
  }
  /**
   * Initialize language from localStorage or browser preference
   */
  initializeLanguage() {
    const savedLanguage = localStorage.getItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.languageKey);
    const browserLanguage = this.getBrowserLanguage();
    const defaultLanguage = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.defaultLanguage;
    let targetLanguage;
    if (savedLanguage && this.isSupportedLanguage(savedLanguage)) {
      targetLanguage = savedLanguage;
    } else if (this.isSupportedLanguage(browserLanguage)) {
      targetLanguage = browserLanguage;
    } else {
      targetLanguage = defaultLanguage;
    }
    // Load initial translations
    this.loadTranslations(targetLanguage).subscribe(() => {
      this.currentLanguageSubject.next(targetLanguage);
      this.updateDocumentLanguage(targetLanguage);
    });
  }
  /**
   * Get browser language
   */
  getBrowserLanguage() {
    if (typeof navigator !== 'undefined') {
      return navigator.language?.split('-')[0] || 'en';
    }
    return 'en';
  }
  /**
   * Check if language is supported
   */
  isSupportedLanguage(language) {
    return _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.supportedLanguages.includes(language);
  }
  /**
   * Save language preference to localStorage
   */
  saveLanguagePreference(language) {
    localStorage.setItem(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.storage.languageKey, language);
  }
  /**
   * Update document language attribute and direction
   */
  updateDocumentLanguage(language) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      // Thai is LTR, but in case we add RTL languages in the future
      document.documentElement.dir = 'ltr';
    }
  }
  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, key) {
    return key.split('.').reduce((current, prop) => {
      return current?.[prop];
    }, obj);
  }
  /**
   * Toggle between Thai and English
   */
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'th' ? 'en' : 'th';
    return this.setLanguage(newLanguage);
  }
  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return [{
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย'
    }, {
      code: 'en',
      name: 'English',
      nativeName: 'English'
    }];
  }
  /**
   * Check if current language is Thai
   */
  isThaiLanguage() {
    return this.currentLanguage === 'th';
  }
  /**
   * Check if current language is English
   */
  isEnglishLanguage() {
    return this.currentLanguage === 'en';
  }
  /**
   * Format number according to current locale
   */
  formatNumber(value, options) {
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  }
  /**
   * Format currency in Thai Baht
   */
  formatCurrency(value) {
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }
  /**
   * Format date according to current locale
   */
  formatDate(date, options) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, {
      ...defaultOptions,
      ...options
    }).format(dateObj);
  }
  /**
   * Format date time according to current locale
   */
  formatDateTime(date, options) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat(locale, {
      ...defaultOptions,
      ...options
    }).format(dateObj);
  }
  static {
    this.ɵfac = function TranslationService_Factory(t) {
      return new (t || TranslationService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
      token: TranslationService,
      factory: TranslationService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8709:
/*!******************************************************************************!*\
  !*** ./src/app/shared/components/confirm-dialog/confirm-dialog.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmDialogComponent: () => (/* binding */ ConfirmDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 2587);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 3840);






function ConfirmDialogComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
}
function ConfirmDialogComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
}
function ConfirmDialogComponent_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "info");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
}
class ConfirmDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.data.type = this.data.type || 'info';
  }
  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
  static {
    this.ɵfac = function ConfirmDialogComponent_Factory(t) {
      return new (t || ConfirmDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ConfirmDialogComponent,
      selectors: [["app-confirm-dialog"]],
      decls: 14,
      vars: 9,
      consts: [[1, "confirm-dialog", 3, "ngClass"], ["mat-dialog-title", "", 1, "dialog-title"], [3, "ngSwitch"], [4, "ngSwitchCase"], [4, "ngSwitchDefault"], [1, "dialog-content"], [3, "innerHTML"], [1, "dialog-actions"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", 3, "click", "color"]],
      template: function ConfirmDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1)(2, "mat-icon", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, ConfirmDialogComponent_ng_container_3_Template, 2, 0, "ng-container", 3)(4, ConfirmDialogComponent_ng_container_4_Template, 2, 0, "ng-container", 3)(5, ConfirmDialogComponent_ng_container_5_Template, 2, 0, "ng-container", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-dialog-content", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-dialog-actions", 7)(10, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConfirmDialogComponent_Template_button_click_10_listener() {
            return ctx.onCancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConfirmDialogComponent_Template_button_click_12_listener() {
            return ctx.onConfirm();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "dialog-" + ctx.data.type);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngSwitch", ctx.data.type);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngSwitchCase", "warning");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngSwitchCase", "danger");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.data.title, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerHTML", ctx.data.message, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeHtml"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.data.cancelText || "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("color", ctx.data.type === "danger" ? "warn" : "primary");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.data.confirmText || "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19", " ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgSwitchCase, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgSwitchDefault, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogContent],
      styles: [".confirm-dialog[_ngcontent-%COMP%] {\n  min-width: 320px;\n  max-width: 500px;\n}\n\n.dialog-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 16px;\n}\n\n.dialog-content[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  line-height: 1.5;\n}\n\n.dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n.dialog-warning[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #ff9800;\n}\n\n.dialog-danger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n\n.dialog-info[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2196f3;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvY29uZmlybS1kaWFsb2cvY29uZmlybS1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNJO0VBQ0UsZ0JBQUE7RUFDQSxnQkFBQTtBQUFOOztBQUdJO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLG1CQUFBO0FBQU47O0FBR0k7RUFDRSxtQkFBQTtFQUNBLGdCQUFBO0FBQU47O0FBR0k7RUFDRSxhQUFBO0VBQ0EseUJBQUE7RUFDQSxRQUFBO0FBQU47O0FBR0k7RUFBNEIsY0FBQTtBQUNoQzs7QUFBSTtFQUEyQixjQUFBO0FBSS9COztBQUhJO0VBQXlCLGNBQUE7QUFPN0IiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAuY29uZmlybS1kaWFsb2cge1xuICAgICAgbWluLXdpZHRoOiAzMjBweDtcbiAgICAgIG1heC13aWR0aDogNTAwcHg7XG4gICAgfVxuICAgIFxuICAgIC5kaWFsb2ctdGl0bGUge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBnYXA6IDhweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuICAgIFxuICAgIC5kaWFsb2ctY29udGVudCB7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICB9XG4gICAgXG4gICAgLmRpYWxvZy1hY3Rpb25zIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuICAgIFxuICAgIC5kaWFsb2ctd2FybmluZyAubWF0LWljb24geyBjb2xvcjogI2ZmOTgwMDsgfVxuICAgIC5kaWFsb2ctZGFuZ2VyIC5tYXQtaWNvbiB7IGNvbG9yOiAjZjQ0MzM2OyB9XG4gICAgLmRpYWxvZy1pbmZvIC5tYXQtaWNvbiB7IGNvbG9yOiAjMjE5NmYzOyB9XG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 4901:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/data-table/data-table.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataTableComponent: () => (/* binding */ DataTableComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class DataTableComponent {
  static {
    this.ɵfac = function DataTableComponent_Factory(t) {
      return new (t || DataTableComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DataTableComponent,
      selectors: [["app-data-table"]],
      decls: 2,
      vars: 0,
      template: function DataTableComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Data Table Component");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5577:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/empty-state/empty-state.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyStateComponent: () => (/* binding */ EmptyStateComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class EmptyStateComponent {
  static {
    this.ɵfac = function EmptyStateComponent_Factory(t) {
      return new (t || EmptyStateComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EmptyStateComponent,
      selectors: [["app-empty-state"]],
      decls: 2,
      vars: 0,
      template: function EmptyStateComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Empty State Component");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 4317:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/file-upload/file-upload.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileUploadComponent: () => (/* binding */ FileUploadComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class FileUploadComponent {
  static {
    this.ɵfac = function FileUploadComponent_Factory(t) {
      return new (t || FileUploadComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FileUploadComponent,
      selectors: [["app-file-upload"]],
      decls: 2,
      vars: 0,
      template: function FileUploadComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "File Upload Component");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 4333:
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/loading-spinner/loading-spinner.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadingSpinnerComponent: () => (/* binding */ LoadingSpinnerComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/progress-spinner */ 1134);



function LoadingSpinnerComponent_p_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.message);
  }
}
class LoadingSpinnerComponent {
  constructor() {
    this.diameter = 40;
    this.strokeWidth = 4;
    this.message = '';
    this.height = 'auto';
  }
  static {
    this.ɵfac = function LoadingSpinnerComponent_Factory(t) {
      return new (t || LoadingSpinnerComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: LoadingSpinnerComponent,
      selectors: [["app-loading-spinner"]],
      inputs: {
        diameter: "diameter",
        strokeWidth: "strokeWidth",
        message: "message",
        height: "height"
      },
      decls: 3,
      vars: 5,
      consts: [[1, "loading-container"], [3, "diameter", "strokeWidth"], ["class", "loading-message", 4, "ngIf"], [1, "loading-message"]],
      template: function LoadingSpinnerComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "mat-spinner", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, LoadingSpinnerComponent_p_2_Template, 2, 1, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("height", ctx.height);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("diameter", ctx.diameter)("strokeWidth", ctx.strokeWidth);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.message);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_2__.MatProgressSpinner],
      styles: [".loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n\n.loading-message[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  color: #666;\n  font-size: 14px;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbG9hZGluZy1zcGlubmVyL2xvYWRpbmctc3Bpbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0k7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtBQUFOOztBQUdJO0VBQ0UsZ0JBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0FBQU4iLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAubG9hZGluZy1jb250YWluZXIge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICBwYWRkaW5nOiAyMHB4O1xuICAgIH1cbiAgICBcbiAgICAubG9hZGluZy1tZXNzYWdlIHtcbiAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgICBjb2xvcjogIzY2NjtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 3301:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/page-header/page-header.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageHeaderComponent: () => (/* binding */ PageHeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class PageHeaderComponent {
  static {
    this.ɵfac = function PageHeaderComponent_Factory(t) {
      return new (t || PageHeaderComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PageHeaderComponent,
      selectors: [["app-page-header"]],
      decls: 2,
      vars: 0,
      template: function PageHeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Page Header Component");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 1541:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/status-chip/status-chip.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusChipComponent: () => (/* binding */ StatusChipComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class StatusChipComponent {
  static {
    this.ɵfac = function StatusChipComponent_Factory(t) {
      return new (t || StatusChipComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: StatusChipComponent,
      selectors: [["app-status-chip"]],
      decls: 2,
      vars: 0,
      template: function StatusChipComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Status Chip Component");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 3603:
/*!**********************************************************!*\
  !*** ./src/app/shared/directives/autofocus.directive.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AutofocusDirective: () => (/* binding */ AutofocusDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class AutofocusDirective {
  constructor(elementRef) {
    this.elementRef = elementRef;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 0);
  }
  static {
    this.ɵfac = function AutofocusDirective_Factory(t) {
      return new (t || AutofocusDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
    };
  }
  static {
    this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: AutofocusDirective,
      selectors: [["", "appAutofocus", ""]]
    });
  }
}

/***/ }),

/***/ 6240:
/*!**************************************************************!*\
  !*** ./src/app/shared/directives/click-outside.directive.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClickOutsideDirective: () => (/* binding */ ClickOutsideDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class ClickOutsideDirective {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.clickOutside = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  }
  onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
  static {
    this.ɵfac = function ClickOutsideDirective_Factory(t) {
      return new (t || ClickOutsideDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
    };
  }
  static {
    this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: ClickOutsideDirective,
      selectors: [["", "appClickOutside", ""]],
      hostBindings: function ClickOutsideDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ClickOutsideDirective_click_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveDocument"]);
        }
      },
      outputs: {
        clickOutside: "clickOutside"
      }
    });
  }
}

/***/ }),

/***/ 1498:
/*!*************************************************************!*\
  !*** ./src/app/shared/directives/numeric-only.directive.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumericOnlyDirective: () => (/* binding */ NumericOnlyDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class NumericOnlyDirective {
  constructor(elementRef) {
    this.elementRef = elementRef;
  }
  onKeyDown(event) {
    // Allow backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    event.keyCode === 65 && event.ctrlKey || event.keyCode === 67 && event.ctrlKey || event.keyCode === 86 && event.ctrlKey || event.keyCode === 88 && event.ctrlKey ||
    // Allow home, end, left, right
    event.keyCode >= 35 && event.keyCode <= 39) {
      return true;
    }
    // Ensure it's a number and stop keypress
    if ((event.shiftKey || event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  static {
    this.ɵfac = function NumericOnlyDirective_Factory(t) {
      return new (t || NumericOnlyDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
    };
  }
  static {
    this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: NumericOnlyDirective,
      selectors: [["", "appNumericOnly", ""]],
      hostBindings: function NumericOnlyDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function NumericOnlyDirective_keydown_HostBindingHandler($event) {
            return ctx.onKeyDown($event);
          });
        }
      }
    });
  }
}

/***/ }),

/***/ 1189:
/*!*****************************************************************!*\
  !*** ./src/app/shared/directives/thai-national-id.directive.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThaiNationalIdDirective: () => (/* binding */ ThaiNationalIdDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class ThaiNationalIdDirective {
  constructor(elementRef) {
    this.elementRef = elementRef;
  }
  onInput(event) {
    let value = event.target.value.replace(/\D/g, '');
    // Limit to 13 digits
    if (value.length > 13) {
      value = value.substring(0, 13);
    }
    // Format as 1-2345-67890-12-3
    if (value.length > 0) {
      if (value.length <= 1) {
        value = value;
      } else if (value.length <= 5) {
        value = value.substring(0, 1) + '-' + value.substring(1);
      } else if (value.length <= 10) {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5);
      } else if (value.length <= 12) {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5, 10) + '-' + value.substring(10);
      } else {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5, 10) + '-' + value.substring(10, 12) + '-' + value.substring(12);
      }
    }
    event.target.value = value;
  }
  static {
    this.ɵfac = function ThaiNationalIdDirective_Factory(t) {
      return new (t || ThaiNationalIdDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
    };
  }
  static {
    this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: ThaiNationalIdDirective,
      selectors: [["", "appThaiNationalId", ""]],
      hostBindings: function ThaiNationalIdDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function ThaiNationalIdDirective_input_HostBindingHandler($event) {
            return ctx.onInput($event);
          });
        }
      }
    });
  }
}

/***/ }),

/***/ 7732:
/*!*********************************************************!*\
  !*** ./src/app/shared/pipes/format-national-id.pipe.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormatNationalIdPipe: () => (/* binding */ FormatNationalIdPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class FormatNationalIdPipe {
  transform(value) {
    if (!value) return '';
    // Format Thai National ID: 1-2345-67890-12-3
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 13) {
      return cleanValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
    }
    return value;
  }
  static {
    this.ɵfac = function FormatNationalIdPipe_Factory(t) {
      return new (t || FormatNationalIdPipe)();
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "formatNationalId",
      type: FormatNationalIdPipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 6332:
/*!***************************************************!*\
  !*** ./src/app/shared/pipes/format-phone.pipe.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormatPhonePipe: () => (/* binding */ FormatPhonePipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class FormatPhonePipe {
  transform(value) {
    if (!value) return '';
    // Format Thai phone: 012-345-6789
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 10) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return value;
  }
  static {
    this.ɵfac = function FormatPhonePipe_Factory(t) {
      return new (t || FormatPhonePipe)();
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "formatPhone",
      type: FormatPhonePipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 247:
/*!************************************************!*\
  !*** ./src/app/shared/pipes/safe-html.pipe.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SafeHtmlPipe: () => (/* binding */ SafeHtmlPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 436);


class SafeHtmlPipe {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }
  transform(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  static {
    this.ɵfac = function SafeHtmlPipe_Factory(t) {
      return new (t || SafeHtmlPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.DomSanitizer, 16));
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "safeHtml",
      type: SafeHtmlPipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 9986:
/*!****************************************************!*\
  !*** ./src/app/shared/pipes/thai-currency.pipe.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThaiCurrencyPipe: () => (/* binding */ ThaiCurrencyPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_translation_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/services/translation.service */ 2243);


class ThaiCurrencyPipe {
  constructor(translationService) {
    this.translationService = translationService;
  }
  transform(value) {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return '';
    }
    return this.translationService.formatCurrency(numValue);
  }
  static {
    this.ɵfac = function ThaiCurrencyPipe_Factory(t) {
      return new (t || ThaiCurrencyPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_translation_service__WEBPACK_IMPORTED_MODULE_0__.TranslationService, 16));
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
      name: "thaiCurrency",
      type: ThaiCurrencyPipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 7131:
/*!************************************************!*\
  !*** ./src/app/shared/pipes/thai-date.pipe.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThaiDatePipe: () => (/* binding */ ThaiDatePipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class ThaiDatePipe {
  transform(value) {
    return value ? new Date(value).toLocaleDateString('th-TH') : '';
  }
  static {
    this.ɵfac = function ThaiDatePipe_Factory(t) {
      return new (t || ThaiDatePipe)();
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "thaiDate",
      type: ThaiDatePipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 4112:
/*!**************************************************!*\
  !*** ./src/app/shared/pipes/thai-number.pipe.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThaiNumberPipe: () => (/* binding */ ThaiNumberPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class ThaiNumberPipe {
  transform(value) {
    return value ? Number(value).toLocaleString('th-TH') : '';
  }
  static {
    this.ɵfac = function ThaiNumberPipe_Factory(t) {
      return new (t || ThaiNumberPipe)();
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "thaiNumber",
      type: ThaiNumberPipe,
      pure: true
    });
  }
}

/***/ }),

/***/ 5094:
/*!************************************************!*\
  !*** ./src/app/shared/pipes/translate.pipe.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TranslatePipe: () => (/* binding */ TranslatePipe)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_translation_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/services/translation.service */ 2243);




class TranslatePipe {
  constructor(translationService) {
    this.translationService = translationService;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.lastKey = '';
    this.lastValue = '';
    // Subscribe to language changes to trigger updates
    this.translationService.currentLanguage$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(this.destroy$)).subscribe(() => {
      this.lastKey = ''; // Reset to trigger retranslation
    });
  }
  transform(key, params) {
    if (!key) return '';
    // Check if we need to retranslate
    const cacheKey = key + JSON.stringify(params || {});
    if (this.lastKey !== cacheKey) {
      this.lastKey = cacheKey;
      this.lastValue = this.translationService.translate(key, params);
    }
    return this.lastValue;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  static {
    this.ɵfac = function TranslatePipe_Factory(t) {
      return new (t || TranslatePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_translation_service__WEBPACK_IMPORTED_MODULE_0__.TranslationService, 16));
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefinePipe"]({
      name: "translate",
      type: TranslatePipe,
      pure: false
    });
  }
}

/***/ }),

/***/ 3887:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedModule: () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/input */ 5541);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/form-field */ 4950);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/progress-spinner */ 1134);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/dialog */ 2587);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/select */ 5175);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/checkbox */ 7024);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/datepicker */ 1977);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/material/table */ 7697);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/paginator */ 4624);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/sort */ 2047);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/chips */ 2772);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/tooltip */ 640);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/material/progress-bar */ 6354);
/* harmony import */ var ngx_mask__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ngx-mask */ 6769);
/* harmony import */ var _components_loading_spinner_loading_spinner_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/loading-spinner/loading-spinner.component */ 4333);
/* harmony import */ var _components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/confirm-dialog/confirm-dialog.component */ 8709);
/* harmony import */ var _components_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/file-upload/file-upload.component */ 4317);
/* harmony import */ var _components_data_table_data_table_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/data-table/data-table.component */ 4901);
/* harmony import */ var _components_page_header_page_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/page-header/page-header.component */ 3301);
/* harmony import */ var _components_empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/empty-state/empty-state.component */ 5577);
/* harmony import */ var _components_status_chip_status_chip_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/status-chip/status-chip.component */ 1541);
/* harmony import */ var _pipes_translate_pipe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pipes/translate.pipe */ 5094);
/* harmony import */ var _pipes_thai_date_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pipes/thai-date.pipe */ 7131);
/* harmony import */ var _pipes_thai_currency_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pipes/thai-currency.pipe */ 9986);
/* harmony import */ var _pipes_thai_number_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pipes/thai-number.pipe */ 4112);
/* harmony import */ var _pipes_safe_html_pipe__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pipes/safe-html.pipe */ 247);
/* harmony import */ var _pipes_format_national_id_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pipes/format-national-id.pipe */ 7732);
/* harmony import */ var _pipes_format_phone_pipe__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pipes/format-phone.pipe */ 6332);
/* harmony import */ var _directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./directives/autofocus.directive */ 3603);
/* harmony import */ var _directives_click_outside_directive__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./directives/click-outside.directive */ 6240);
/* harmony import */ var _directives_numeric_only_directive__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./directives/numeric-only.directive */ 1498);
/* harmony import */ var _directives_thai_national_id_directive__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./directives/thai-national-id.directive */ 1189);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @angular/core */ 7580);



// Angular Material Modules


















// NGX Mask for input formatting

// Shared Components







// Shared Pipes







// Shared Directives





const MATERIAL_MODULES = [_angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_22__.MatCardModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_23__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_25__.MatDialogModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_26__.MatSelectModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_27__.MatCheckboxModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_28__.MatDatepickerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_34__.MatTooltipModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_35__.MatProgressBarModule];
const SHARED_COMPONENTS = [_components_loading_spinner_loading_spinner_component__WEBPACK_IMPORTED_MODULE_0__.LoadingSpinnerComponent, _components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ConfirmDialogComponent, _components_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_2__.FileUploadComponent, _components_data_table_data_table_component__WEBPACK_IMPORTED_MODULE_3__.DataTableComponent, _components_page_header_page_header_component__WEBPACK_IMPORTED_MODULE_4__.PageHeaderComponent, _components_empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_5__.EmptyStateComponent, _components_status_chip_status_chip_component__WEBPACK_IMPORTED_MODULE_6__.StatusChipComponent];
const SHARED_PIPES = [_pipes_translate_pipe__WEBPACK_IMPORTED_MODULE_7__.TranslatePipe, _pipes_thai_date_pipe__WEBPACK_IMPORTED_MODULE_8__.ThaiDatePipe, _pipes_thai_currency_pipe__WEBPACK_IMPORTED_MODULE_9__.ThaiCurrencyPipe, _pipes_thai_number_pipe__WEBPACK_IMPORTED_MODULE_10__.ThaiNumberPipe, _pipes_safe_html_pipe__WEBPACK_IMPORTED_MODULE_11__.SafeHtmlPipe, _pipes_format_national_id_pipe__WEBPACK_IMPORTED_MODULE_12__.FormatNationalIdPipe, _pipes_format_phone_pipe__WEBPACK_IMPORTED_MODULE_13__.FormatPhonePipe];
const SHARED_DIRECTIVES = [_directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_14__.AutofocusDirective, _directives_click_outside_directive__WEBPACK_IMPORTED_MODULE_15__.ClickOutsideDirective, _directives_numeric_only_directive__WEBPACK_IMPORTED_MODULE_16__.NumericOnlyDirective, _directives_thai_national_id_directive__WEBPACK_IMPORTED_MODULE_17__.ThaiNationalIdDirective];
class SharedModule {
  static {
    this.ɵfac = function SharedModule_Factory(t) {
      return new (t || SharedModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_36__["ɵɵdefineNgModule"]({
      type: SharedModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_36__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_37__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_39__.RouterModule, MATERIAL_MODULES,
      // Angular modules
      _angular_common__WEBPACK_IMPORTED_MODULE_37__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_39__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_22__.MatCardModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_23__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_25__.MatDialogModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_26__.MatSelectModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_27__.MatCheckboxModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_28__.MatDatepickerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_34__.MatTooltipModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_35__.MatProgressBarModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_36__["ɵɵsetNgModuleScope"](SharedModule, {
    declarations: [_components_loading_spinner_loading_spinner_component__WEBPACK_IMPORTED_MODULE_0__.LoadingSpinnerComponent, _components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ConfirmDialogComponent, _components_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_2__.FileUploadComponent, _components_data_table_data_table_component__WEBPACK_IMPORTED_MODULE_3__.DataTableComponent, _components_page_header_page_header_component__WEBPACK_IMPORTED_MODULE_4__.PageHeaderComponent, _components_empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_5__.EmptyStateComponent, _components_status_chip_status_chip_component__WEBPACK_IMPORTED_MODULE_6__.StatusChipComponent, _pipes_translate_pipe__WEBPACK_IMPORTED_MODULE_7__.TranslatePipe, _pipes_thai_date_pipe__WEBPACK_IMPORTED_MODULE_8__.ThaiDatePipe, _pipes_thai_currency_pipe__WEBPACK_IMPORTED_MODULE_9__.ThaiCurrencyPipe, _pipes_thai_number_pipe__WEBPACK_IMPORTED_MODULE_10__.ThaiNumberPipe, _pipes_safe_html_pipe__WEBPACK_IMPORTED_MODULE_11__.SafeHtmlPipe, _pipes_format_national_id_pipe__WEBPACK_IMPORTED_MODULE_12__.FormatNationalIdPipe, _pipes_format_phone_pipe__WEBPACK_IMPORTED_MODULE_13__.FormatPhonePipe, _directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_14__.AutofocusDirective, _directives_click_outside_directive__WEBPACK_IMPORTED_MODULE_15__.ClickOutsideDirective, _directives_numeric_only_directive__WEBPACK_IMPORTED_MODULE_16__.NumericOnlyDirective, _directives_thai_national_id_directive__WEBPACK_IMPORTED_MODULE_17__.ThaiNationalIdDirective],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_37__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_39__.RouterModule, ngx_mask__WEBPACK_IMPORTED_MODULE_40__.NgxMaskDirective, ngx_mask__WEBPACK_IMPORTED_MODULE_40__.NgxMaskPipe, _angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_22__.MatCardModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_23__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_25__.MatDialogModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_26__.MatSelectModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_27__.MatCheckboxModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_28__.MatDatepickerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_34__.MatTooltipModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_35__.MatProgressBarModule],
    exports: [
    // Angular modules
    _angular_common__WEBPACK_IMPORTED_MODULE_37__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_38__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_39__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInputModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_22__.MatCardModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_23__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_25__.MatDialogModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_26__.MatSelectModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_27__.MatCheckboxModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_28__.MatDatepickerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_29__.MatTableModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_30__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_31__.MatSortModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_33__.MatMenuModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_34__.MatTooltipModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_35__.MatProgressBarModule,
    // NGX modules
    ngx_mask__WEBPACK_IMPORTED_MODULE_40__.NgxMaskDirective, ngx_mask__WEBPACK_IMPORTED_MODULE_40__.NgxMaskPipe, _components_loading_spinner_loading_spinner_component__WEBPACK_IMPORTED_MODULE_0__.LoadingSpinnerComponent, _components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ConfirmDialogComponent, _components_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_2__.FileUploadComponent, _components_data_table_data_table_component__WEBPACK_IMPORTED_MODULE_3__.DataTableComponent, _components_page_header_page_header_component__WEBPACK_IMPORTED_MODULE_4__.PageHeaderComponent, _components_empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_5__.EmptyStateComponent, _components_status_chip_status_chip_component__WEBPACK_IMPORTED_MODULE_6__.StatusChipComponent, _pipes_translate_pipe__WEBPACK_IMPORTED_MODULE_7__.TranslatePipe, _pipes_thai_date_pipe__WEBPACK_IMPORTED_MODULE_8__.ThaiDatePipe, _pipes_thai_currency_pipe__WEBPACK_IMPORTED_MODULE_9__.ThaiCurrencyPipe, _pipes_thai_number_pipe__WEBPACK_IMPORTED_MODULE_10__.ThaiNumberPipe, _pipes_safe_html_pipe__WEBPACK_IMPORTED_MODULE_11__.SafeHtmlPipe, _pipes_format_national_id_pipe__WEBPACK_IMPORTED_MODULE_12__.FormatNationalIdPipe, _pipes_format_phone_pipe__WEBPACK_IMPORTED_MODULE_13__.FormatPhonePipe, _directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_14__.AutofocusDirective, _directives_click_outside_directive__WEBPACK_IMPORTED_MODULE_15__.ClickOutsideDirective, _directives_numeric_only_directive__WEBPACK_IMPORTED_MODULE_16__.NumericOnlyDirective, _directives_thai_national_id_directive__WEBPACK_IMPORTED_MODULE_17__.ThaiNationalIdDirective]
  });
})();

/***/ }),

/***/ 5312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  version: '1.0.0',
  appName: 'Thai Auto Insurance',
  supportedLanguages: ['th', 'en'],
  defaultLanguage: 'th',
  features: {
    enablePWA: false,
    enableAnalytics: false,
    enableServiceWorker: false,
    enableDebugMode: true,
    enableMockData: true
  },
  external: {
    googleMapsApiKey: '',
    firebaseConfig: null,
    sentryDsn: '' // Optional: for error tracking
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  storage: {
    tokenKey: 'thai_auto_insurance_token',
    userKey: 'thai_auto_insurance_user',
    languageKey: 'thai_auto_insurance_lang'
  }
};

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 635);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule, {
  ngZoneEventCoalescing: true
}).catch(err => console.error('Error starting the application:', err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map