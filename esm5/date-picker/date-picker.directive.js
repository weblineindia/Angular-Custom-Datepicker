import { __decorate, __param } from "tslib";
import { DatePickerDirectiveService } from './date-picker-directive.service';
import { DatePickerComponent } from './date-picker.component';
import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var DatePickerDirective = /** @class */ (function () {
    function DatePickerDirective(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
        this.viewContainerRef = viewContainerRef;
        this.elemRef = elemRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.service = service;
        this.formControl = formControl;
        this.utilsService = utilsService;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this._mode = 'day';
    }
    Object.defineProperty(DatePickerDirective.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (config) {
            this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "attachTo", {
        get: function () {
            return this._attachTo;
        },
        set: function (attachTo) {
            this._attachTo = attachTo;
            this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (theme) {
            this._theme = theme;
            if (this.datePicker) {
                this.datePicker.theme = theme;
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            this._mode = mode;
            if (this.datePicker) {
                this.datePicker.mode = mode;
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (minDate) {
            this._minDate = minDate;
            if (this.datePicker) {
                this.datePicker.minDate = minDate;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (maxDate) {
            this._maxDate = maxDate;
            if (this.datePicker) {
                this.datePicker.maxDate = maxDate;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "minTime", {
        get: function () {
            return this._minTime;
        },
        set: function (minTime) {
            this._minTime = minTime;
            if (this.datePicker) {
                this.datePicker.minTime = minTime;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "maxTime", {
        get: function () {
            return this._maxTime;
        },
        set: function (maxTime) {
            this._maxTime = maxTime;
            if (this.datePicker) {
                this.datePicker.maxTime = maxTime;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "displayDate", {
        get: function () {
            return this._displayDate;
        },
        set: function (displayDate) {
            this._displayDate = displayDate;
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    DatePickerDirective.prototype.ngOnInit = function () {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    };
    DatePickerDirective.prototype.createDatePicker = function () {
        var factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    };
    DatePickerDirective.prototype.attachModelToDatePicker = function () {
        var _this = this;
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe(function (value) {
            if (value !== _this.datePicker.inputElementValue) {
                var strVal = _this.utilsService.convertToString(value, _this.datePicker.componentConfig.format);
                _this.datePicker.onViewDateChange(strVal);
            }
        });
        var setup = true;
        this.datePicker.registerOnChange(function (value, changedByInput) {
            if (value) {
                var isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    _this.formControl.control.setValue(_this.datePicker.inputElementValue);
                }
            }
            var errors = _this.datePicker.validateFn(value);
            if (!setup) {
                _this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    var given = errors['format'].given;
                    _this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        _this.formControl.control.setValue(given);
                    }
                }
                _this.formControl.control.setErrors(errors);
            }
        });
    };
    DatePickerDirective.prototype.onClick = function () {
        this.datePicker.onClick();
    };
    DatePickerDirective.prototype.onFocus = function () {
        this.datePicker.inputFocused();
    };
    DatePickerDirective.prototype.onEnter = function () {
        if (this.datePicker.componentConfig.closeOnEnter) {
            this.datePicker.hideCalendar();
        }
    };
    DatePickerDirective.prototype.markForCheck = function () {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    };
    DatePickerDirective.prototype.updateDatepickerConfig = function () {
        if (this.datePicker) {
            this.datePicker.minDate = this.minDate;
            this.datePicker.maxDate = this.maxDate;
            this.datePicker.minTime = this.minTime;
            this.datePicker.maxTime = this.maxTime;
            this.datePicker.mode = this.mode || 'day';
            this.datePicker.displayDate = this.displayDate;
            this.datePicker.config = this.config;
            this.datePicker.open = this.open;
            this.datePicker.close = this.close;
            this.datePicker.onChange = this.onChange;
            this.datePicker.onGoToCurrent = this.onGoToCurrent;
            this.datePicker.onLeftNav = this.onLeftNav;
            this.datePicker.onRightNav = this.onRightNav;
            this.datePicker.onSelect = this.onSelect;
            this.datePicker.init();
            if (this.datePicker.componentConfig.disableKeypress) {
                this.elemRef.nativeElement.setAttribute('readonly', true);
            }
            else {
                this.elemRef.nativeElement.removeAttribute('readonly');
            }
        }
    };
    DatePickerDirective.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: DatePickerDirectiveService },
        { type: NgControl, decorators: [{ type: Optional }] },
        { type: UtilsService }
    ]; };
    __decorate([
        Input('dpDayPicker')
    ], DatePickerDirective.prototype, "config", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "attachTo", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "theme", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "mode", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "minDate", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "maxDate", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "minTime", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "maxTime", null);
    __decorate([
        Input()
    ], DatePickerDirective.prototype, "displayDate", null);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "open", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "close", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "onChange", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "onGoToCurrent", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "onLeftNav", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "onRightNav", void 0);
    __decorate([
        Output()
    ], DatePickerDirective.prototype, "onSelect", void 0);
    __decorate([
        HostListener('click')
    ], DatePickerDirective.prototype, "onClick", null);
    __decorate([
        HostListener('focus')
    ], DatePickerDirective.prototype, "onFocus", null);
    __decorate([
        HostListener('keydown.enter')
    ], DatePickerDirective.prototype, "onEnter", null);
    DatePickerDirective = __decorate([
        Directive({
            exportAs: 'dpDayPicker',
            providers: [DatePickerDirectiveService],
            selector: '[dpDayPicker]'
        }),
        __param(4, Optional())
    ], DatePickerDirective);
    return DatePickerDirective;
}());
export { DatePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUUzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUd6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUE7QUFPbkU7SUFnSkUsNkJBQW1CLGdCQUFrQyxFQUNsQyxPQUFtQixFQUNuQix3QkFBa0QsRUFDbEQsT0FBbUMsRUFDdkIsV0FBc0IsRUFDbEMsWUFBMEI7UUFMMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVc7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFqQ25DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2hDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUM3QyxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZ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QUU7MERBQXlEO0lBQ3hEO1FBQVQsTUFBTSxFQUFFOzJEQUEwRDtJQUN6RDtRQUFULE1BQU0sRUFBRTt5REFBOEQ7SUE2RnZFO1FBREMsWUFBWSxDQUFDLE9BQU8sQ0FBQztzREFHckI7SUFHRDtRQURDLFlBQVksQ0FBQyxPQUFPLENBQUM7c0RBR3JCO0lBR0Q7UUFEQyxZQUFZLENBQUMsZUFBZSxDQUFDO3NEQUs3QjtJQXJPVSxtQkFBbUI7UUFML0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7WUFDdkMsUUFBUSxFQUFFLGVBQWU7U0FDMUIsQ0FBQztRQXFKYSxXQUFBLFFBQVEsRUFBRSxDQUFBO09BcEpaLG1CQUFtQixDQXVRL0I7SUFBRCwwQkFBQztDQUFBLEFBdlFELElBdVFDO1NBdlFZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZSc7XG5pbXBvcnQge0lEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnfSBmcm9tICcuL2RhdGUtcGlja2VyLWRpcmVjdGl2ZS1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtEYXRlUGlja2VyRGlyZWN0aXZlU2VydmljZX0gZnJvbSAnLi9kYXRlLXBpY2tlci1kaXJlY3RpdmUuc2VydmljZSc7XG5pbXBvcnQge0lEcERheVBpY2tlckFwaX0gZnJvbSAnLi9kYXRlLXBpY2tlci5hcGknO1xuaW1wb3J0IHtEYXRlUGlja2VyQ29tcG9uZW50fSBmcm9tICcuL2RhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlLCBJU2VsZWN0aW9uRXZlbnQsIFNpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uJztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJ1xuXG5ARGlyZWN0aXZlKHtcbiAgZXhwb3J0QXM6ICdkcERheVBpY2tlcicsXG4gIHByb3ZpZGVyczogW0RhdGVQaWNrZXJEaXJlY3RpdmVTZXJ2aWNlXSxcbiAgc2VsZWN0b3I6ICdbZHBEYXlQaWNrZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBnZXQgY29uZmlnKCk6IElEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgQElucHV0KCdkcERheVBpY2tlcicpIHNldCBjb25maWcoY29uZmlnOiBJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZykge1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuc2VydmljZS5nZXRDb25maWcoY29uZmlnLCB0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudCwgdGhpcy5hdHRhY2hUbyk7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBhdHRhY2hUbygpOiBFbGVtZW50UmVmIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoVG87XG4gIH1cblxuICBASW5wdXQoKSBzZXQgYXR0YWNoVG8oYXR0YWNoVG86IEVsZW1lbnRSZWYgfCBzdHJpbmcpIHtcbiAgICB0aGlzLl9hdHRhY2hUbyA9IGF0dGFjaFRvO1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuc2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcsIHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50LCB0aGlzLmF0dGFjaFRvKTtcbiAgICB0aGlzLnVwZGF0ZURhdGVwaWNrZXJDb25maWcoKTtcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHRoZW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RoZW1lO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHRoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aGVtZSA9IHRoZW1lO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci50aGVtZSA9IHRoZW1lO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbW9kZSgpOiBDYWxlbmRhck1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1vZGUobW9kZTogQ2FsZW5kYXJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IG1vZGU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1vZGUgPSBtb2RlO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWluRGF0ZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtaW5EYXRlKG1pbkRhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gbWluRGF0ZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluRGF0ZSA9IG1pbkRhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1heERhdGUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWF4RGF0ZShtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IG1heERhdGU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1heERhdGUgPSBtYXhEYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtaW5UaW1lKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9taW5UaW1lO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1pblRpbWUobWluVGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX21pblRpbWUgPSBtaW5UaW1lO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW5UaW1lID0gbWluVGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWF4VGltZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4VGltZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtYXhUaW1lKG1heFRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9tYXhUaW1lID0gbWF4VGltZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4VGltZSA9IG1heFRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGRpc3BsYXlEYXRlKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5RGF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBkaXNwbGF5RGF0ZShkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX2Rpc3BsYXlEYXRlID0gZGlzcGxheURhdGU7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgQE91dHB1dCgpIG9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhclZhbHVlPigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxJU2VsZWN0aW9uRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBkYXRlUGlja2VyOiBEYXRlUGlja2VyQ29tcG9uZW50O1xuICBhcGk6IElEcERheVBpY2tlckFwaTtcblxuICBwcml2YXRlIF9jb25maWc6IElEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnO1xuXG4gIHByaXZhdGUgX2F0dGFjaFRvOiBFbGVtZW50UmVmIHwgc3RyaW5nO1xuXG4gIHByaXZhdGUgX3RoZW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfbW9kZTogQ2FsZW5kYXJNb2RlID0gJ2RheSc7XG5cbiAgcHJpdmF0ZSBfbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9tYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIHByaXZhdGUgX21pblRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgcHJpdmF0ZSBfbWF4VGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9kaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgcHVibGljIGVsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHVibGljIHNlcnZpY2U6IERhdGVQaWNrZXJEaXJlY3RpdmVTZXJ2aWNlLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgZm9ybUNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICAgICAgICAgICAgcHVibGljIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIgPSB0aGlzLmNyZWF0ZURhdGVQaWNrZXIoKTtcbiAgICB0aGlzLmFwaSA9IHRoaXMuZGF0ZVBpY2tlci5hcGk7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG4gICAgdGhpcy5hdHRhY2hNb2RlbFRvRGF0ZVBpY2tlcigpO1xuICAgIHRoaXMuZGF0ZVBpY2tlci50aGVtZSA9IHRoaXMudGhlbWU7XG4gIH1cblxuICBjcmVhdGVEYXRlUGlja2VyKCk6IERhdGVQaWNrZXJDb21wb25lbnQge1xuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlUGlja2VyQ29tcG9uZW50KTtcbiAgICByZXR1cm4gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KS5pbnN0YW5jZTtcbiAgfVxuXG4gIGF0dGFjaE1vZGVsVG9EYXRlUGlja2VyKCkge1xuICAgIGlmICghdGhpcy5mb3JtQ29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGF0ZVBpY2tlci5vblZpZXdEYXRlQ2hhbmdlKHRoaXMuZm9ybUNvbnRyb2wudmFsdWUpO1xuXG4gICAgdGhpcy5mb3JtQ29udHJvbC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLmRhdGVQaWNrZXIuaW5wdXRFbGVtZW50VmFsdWUpIHtcbiAgICAgICAgY29uc3Qgc3RyVmFsID0gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvU3RyaW5nKHZhbHVlLCB0aGlzLmRhdGVQaWNrZXIuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5vblZpZXdEYXRlQ2hhbmdlKHN0clZhbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc2V0dXAgPSB0cnVlO1xuXG4gICAgdGhpcy5kYXRlUGlja2VyLnJlZ2lzdGVyT25DaGFuZ2UoKHZhbHVlLCBjaGFuZ2VkQnlJbnB1dCkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGlzTXVsdGlzZWxlY3RFbXB0eSA9IHNldHVwICYmIEFycmF5LmlzQXJyYXkodmFsdWUpICYmICF2YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKCFpc011bHRpc2VsZWN0RW1wdHkgJiYgIWNoYW5nZWRCeUlucHV0KSB7XG4gICAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLnNldFZhbHVlKHRoaXMuZGF0ZVBpY2tlci5pbnB1dEVsZW1lbnRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5kYXRlUGlja2VyLnZhbGlkYXRlRm4odmFsdWUpO1xuXG4gICAgICBpZiAoIXNldHVwKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbC5tYXJrQXNEaXJ0eSh7XG4gICAgICAgICAgb25seVNlbGY6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXR1cCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgIGlmIChlcnJvcnMuaGFzT3duUHJvcGVydHkoJ2Zvcm1hdCcpKSB7XG4gICAgICAgICAgY29uc3Qge2dpdmVufSA9IGVycm9yc1snZm9ybWF0J107XG4gICAgICAgICAgdGhpcy5kYXRlUGlja2VyLmlucHV0RWxlbWVudFZhbHVlID0gZ2l2ZW47XG4gICAgICAgICAgaWYgKCFjaGFuZ2VkQnlJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLnNldFZhbHVlKGdpdmVuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2wuc2V0RXJyb3JzKGVycm9ycyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5kYXRlUGlja2VyLm9uQ2xpY2soKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIuaW5wdXRGb2N1c2VkKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVudGVyJylcbiAgb25FbnRlcigpIHtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyLmNvbXBvbmVudENvbmZpZy5jbG9zZU9uRW50ZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5oaWRlQ2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cblxuICBtYXJrRm9yQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpIHtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1pblRpbWUgPSB0aGlzLm1pblRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4VGltZSA9IHRoaXMubWF4VGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tb2RlID0gdGhpcy5tb2RlIHx8ICdkYXknO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmRpc3BsYXlEYXRlID0gdGhpcy5kaXNwbGF5RGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5jb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vcGVuID0gdGhpcy5vcGVuO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmNsb3NlID0gdGhpcy5jbG9zZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2U7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25Hb1RvQ3VycmVudCA9IHRoaXMub25Hb1RvQ3VycmVudDtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vbkxlZnROYXYgPSB0aGlzLm9uTGVmdE5hdjtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vblJpZ2h0TmF2ID0gdGhpcy5vblJpZ2h0TmF2O1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uU2VsZWN0ID0gdGhpcy5vblNlbGVjdDtcblxuICAgICAgdGhpcy5kYXRlUGlja2VyLmluaXQoKTtcblxuICAgICAgaWYgKHRoaXMuZGF0ZVBpY2tlci5jb21wb25lbnRDb25maWcuZGlzYWJsZUtleXByZXNzKSB7XG4gICAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncmVhZG9ubHknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==