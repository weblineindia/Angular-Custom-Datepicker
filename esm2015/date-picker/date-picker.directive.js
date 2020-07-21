import { __decorate, __param } from "tslib";
import { DatePickerDirectiveService } from './date-picker-directive.service';
import { DatePickerComponent } from './date-picker.component';
import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
let DatePickerDirective = class DatePickerDirective {
    constructor(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
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
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    get attachTo() {
        return this._attachTo;
    }
    set attachTo(attachTo) {
        this._attachTo = attachTo;
        this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    get theme() {
        return this._theme;
    }
    set theme(theme) {
        this._theme = theme;
        if (this.datePicker) {
            this.datePicker.theme = theme;
        }
        this.markForCheck();
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        this._mode = mode;
        if (this.datePicker) {
            this.datePicker.mode = mode;
        }
        this.markForCheck();
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(minDate) {
        this._minDate = minDate;
        if (this.datePicker) {
            this.datePicker.minDate = minDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(maxDate) {
        this._maxDate = maxDate;
        if (this.datePicker) {
            this.datePicker.maxDate = maxDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get minTime() {
        return this._minTime;
    }
    set minTime(minTime) {
        this._minTime = minTime;
        if (this.datePicker) {
            this.datePicker.minTime = minTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxTime() {
        return this._maxTime;
    }
    set maxTime(maxTime) {
        this._maxTime = maxTime;
        if (this.datePicker) {
            this.datePicker.maxTime = maxTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get displayDate() {
        return this._displayDate;
    }
    set displayDate(displayDate) {
        this._displayDate = displayDate;
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    ngOnInit() {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    }
    createDatePicker() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    }
    attachModelToDatePicker() {
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe((value) => {
            if (value !== this.datePicker.inputElementValue) {
                const strVal = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
                this.datePicker.onViewDateChange(strVal);
            }
        });
        let setup = true;
        this.datePicker.registerOnChange((value, changedByInput) => {
            if (value) {
                const isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    this.formControl.control.setValue(this.datePicker.inputElementValue);
                }
            }
            const errors = this.datePicker.validateFn(value);
            if (!setup) {
                this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    const { given } = errors['format'];
                    this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        this.formControl.control.setValue(given);
                    }
                }
                this.formControl.control.setErrors(errors);
            }
        });
    }
    onClick() {
        this.datePicker.onClick();
    }
    onFocus() {
        this.datePicker.inputFocused();
    }
    onEnter() {
        if (this.datePicker.componentConfig.closeOnEnter) {
            this.datePicker.hideCalendar();
        }
    }
    markForCheck() {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    }
    updateDatepickerConfig() {
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
    }
};
DatePickerDirective.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: DatePickerDirectiveService },
    { type: NgControl, decorators: [{ type: Optional }] },
    { type: UtilsService }
];
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
export { DatePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUUzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUd6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUE7QUFPbkUsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFnSjlCLFlBQW1CLGdCQUFrQyxFQUNsQyxPQUFtQixFQUNuQix3QkFBa0QsRUFDbEQsT0FBbUMsRUFDdkIsV0FBc0IsRUFDbEMsWUFBMEI7UUFMMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVc7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFqQ25DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2hDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUM3QyxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFB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VCxNQUFNLEVBQUU7dURBQTBEO0FBQ3pEO0lBQVQsTUFBTSxFQUFFO3FEQUE4RDtBQTZGdkU7SUFEQyxZQUFZLENBQUMsT0FBTyxDQUFDO2tEQUdyQjtBQUdEO0lBREMsWUFBWSxDQUFDLE9BQU8sQ0FBQztrREFHckI7QUFHRDtJQURDLFlBQVksQ0FBQyxlQUFlLENBQUM7a0RBSzdCO0FBck9VLG1CQUFtQjtJQUwvQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztRQUN2QyxRQUFRLEVBQUUsZUFBZTtLQUMxQixDQUFDO0lBcUphLFdBQUEsUUFBUSxFQUFFLENBQUE7R0FwSlosbUJBQW1CLENBdVEvQjtTQXZRWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUnO1xuaW1wb3J0IHtJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZ30gZnJvbSAnLi9kYXRlLXBpY2tlci1kaXJlY3RpdmUtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF0ZVBpY2tlckRpcmVjdGl2ZVNlcnZpY2V9IGZyb20gJy4vZGF0ZS1waWNrZXItZGlyZWN0aXZlLnNlcnZpY2UnO1xuaW1wb3J0IHtJRHBEYXlQaWNrZXJBcGl9IGZyb20gJy4vZGF0ZS1waWNrZXIuYXBpJztcbmltcG9ydCB7RGF0ZVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2FsZW5kYXJWYWx1ZSwgSVNlbGVjdGlvbkV2ZW50LCBTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLic7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSdcblxuQERpcmVjdGl2ZSh7XG4gIGV4cG9ydEFzOiAnZHBEYXlQaWNrZXInLFxuICBwcm92aWRlcnM6IFtEYXRlUGlja2VyRGlyZWN0aXZlU2VydmljZV0sXG4gIHNlbGVjdG9yOiAnW2RwRGF5UGlja2VyXSdcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVBpY2tlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgZ2V0IGNvbmZpZygpOiBJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgfVxuXG4gIEBJbnB1dCgnZHBEYXlQaWNrZXInKSBzZXQgY29uZmlnKGNvbmZpZzogSURhdGVQaWNrZXJEaXJlY3RpdmVDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLnNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZywgdGhpcy52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQsIHRoaXMuYXR0YWNoVG8pO1xuICAgIHRoaXMudXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpO1xuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgYXR0YWNoVG8oKTogRWxlbWVudFJlZiB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaFRvO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGF0dGFjaFRvKGF0dGFjaFRvOiBFbGVtZW50UmVmIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fYXR0YWNoVG8gPSBhdHRhY2hUbztcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLnNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnLCB0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudCwgdGhpcy5hdHRhY2hUbyk7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCB0aGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90aGVtZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCB0aGVtZSh0aGVtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGhlbWUgPSB0aGVtZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIudGhlbWUgPSB0aGVtZTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1vZGUoKTogQ2FsZW5kYXJNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtb2RlKG1vZGU6IENhbGVuZGFyTW9kZSkge1xuICAgIHRoaXMuX21vZGUgPSBtb2RlO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tb2RlID0gbW9kZTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1pbkRhdGUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWluRGF0ZShtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IG1pbkRhdGU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1pbkRhdGUgPSBtaW5EYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtYXhEYXRlKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1heERhdGUobWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX21heERhdGUgPSBtYXhEYXRlO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhEYXRlID0gbWF4RGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWluVGltZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWluVGltZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtaW5UaW1lKG1pblRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9taW5UaW1lID0gbWluVGltZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluVGltZSA9IG1pblRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1heFRpbWUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFRpbWU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWF4VGltZShtYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fbWF4VGltZSA9IG1heFRpbWU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1heFRpbWUgPSBtYXhUaW1lO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBkaXNwbGF5RGF0ZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGxheURhdGU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgZGlzcGxheURhdGUoZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9kaXNwbGF5RGF0ZSA9IGRpc3BsYXlEYXRlO1xuICAgIHRoaXMudXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpO1xuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIEBPdXRwdXQoKSBvcGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgY2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJWYWx1ZT4oKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8SVNlbGVjdGlvbkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgZGF0ZVBpY2tlcjogRGF0ZVBpY2tlckNvbXBvbmVudDtcbiAgYXBpOiBJRHBEYXlQaWNrZXJBcGk7XG5cbiAgcHJpdmF0ZSBfY29uZmlnOiBJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZztcblxuICBwcml2YXRlIF9hdHRhY2hUbzogRWxlbWVudFJlZiB8IHN0cmluZztcblxuICBwcml2YXRlIF90aGVtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX21vZGU6IENhbGVuZGFyTW9kZSA9ICdkYXknO1xuXG4gIHByaXZhdGUgX21pbkRhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgcHJpdmF0ZSBfbWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9taW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIHByaXZhdGUgX21heFRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgcHJpdmF0ZSBfZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBlbGVtUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwdWJsaWMgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBzZXJ2aWNlOiBEYXRlUGlja2VyRGlyZWN0aXZlU2VydmljZSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHVibGljIGZvcm1Db250cm9sOiBOZ0NvbnRyb2wsXG4gICAgICAgICAgICAgIHB1YmxpYyB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlUGlja2VyID0gdGhpcy5jcmVhdGVEYXRlUGlja2VyKCk7XG4gICAgdGhpcy5hcGkgPSB0aGlzLmRhdGVQaWNrZXIuYXBpO1xuICAgIHRoaXMudXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpO1xuICAgIHRoaXMuYXR0YWNoTW9kZWxUb0RhdGVQaWNrZXIoKTtcbiAgICB0aGlzLmRhdGVQaWNrZXIudGhlbWUgPSB0aGlzLnRoZW1lO1xuICB9XG5cbiAgY3JlYXRlRGF0ZVBpY2tlcigpOiBEYXRlUGlja2VyQ29tcG9uZW50IHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoRGF0ZVBpY2tlckNvbXBvbmVudCk7XG4gICAgcmV0dXJuIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSkuaW5zdGFuY2U7XG4gIH1cblxuICBhdHRhY2hNb2RlbFRvRGF0ZVBpY2tlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9ybUNvbnRyb2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGVQaWNrZXIub25WaWV3RGF0ZUNoYW5nZSh0aGlzLmZvcm1Db250cm9sLnZhbHVlKTtcblxuICAgIHRoaXMuZm9ybUNvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5kYXRlUGlja2VyLmlucHV0RWxlbWVudFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHN0clZhbCA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSwgdGhpcy5kYXRlUGlja2VyLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgICAgICB0aGlzLmRhdGVQaWNrZXIub25WaWV3RGF0ZUNoYW5nZShzdHJWYWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHNldHVwID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0ZVBpY2tlci5yZWdpc3Rlck9uQ2hhbmdlKCh2YWx1ZSwgY2hhbmdlZEJ5SW5wdXQpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBjb25zdCBpc011bHRpc2VsZWN0RW1wdHkgPSBzZXR1cCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAhdmFsdWUubGVuZ3RoO1xuXG4gICAgICAgIGlmICghaXNNdWx0aXNlbGVjdEVtcHR5ICYmICFjaGFuZ2VkQnlJbnB1dCkge1xuICAgICAgICAgIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbC5zZXRWYWx1ZSh0aGlzLmRhdGVQaWNrZXIuaW5wdXRFbGVtZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuZGF0ZVBpY2tlci52YWxpZGF0ZUZuKHZhbHVlKTtcblxuICAgICAgaWYgKCFzZXR1cCkge1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2wubWFya0FzRGlydHkoe1xuICAgICAgICAgIG9ubHlTZWxmOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dXAgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICBpZiAoZXJyb3JzLmhhc093blByb3BlcnR5KCdmb3JtYXQnKSkge1xuICAgICAgICAgIGNvbnN0IHtnaXZlbn0gPSBlcnJvcnNbJ2Zvcm1hdCddO1xuICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci5pbnB1dEVsZW1lbnRWYWx1ZSA9IGdpdmVuO1xuICAgICAgICAgIGlmICghY2hhbmdlZEJ5SW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbC5zZXRWYWx1ZShnaXZlbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLnNldEVycm9ycyhlcnJvcnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbkNsaWNrKCkge1xuICAgIHRoaXMuZGF0ZVBpY2tlci5vbkNsaWNrKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdmb2N1cycpXG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5kYXRlUGlja2VyLmlucHV0Rm9jdXNlZCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5lbnRlcicpXG4gIG9uRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlci5jb21wb25lbnRDb25maWcuY2xvc2VPbkVudGVyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIuaGlkZUNhbGVuZGFyKCk7XG4gICAgfVxuICB9XG5cbiAgbWFya0ZvckNoZWNrKCkge1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURhdGVwaWNrZXJDb25maWcoKSB7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1pbkRhdGUgPSB0aGlzLm1pbkRhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW5UaW1lID0gdGhpcy5taW5UaW1lO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1heFRpbWUgPSB0aGlzLm1heFRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubW9kZSA9IHRoaXMubW9kZSB8fCAnZGF5JztcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5kaXNwbGF5RGF0ZSA9IHRoaXMuZGlzcGxheURhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIuY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub3BlbiA9IHRoaXMub3BlbjtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5jbG9zZSA9IHRoaXMuY2xvc2U7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uR29Ub0N1cnJlbnQgPSB0aGlzLm9uR29Ub0N1cnJlbnQ7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25MZWZ0TmF2ID0gdGhpcy5vbkxlZnROYXY7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25SaWdodE5hdiA9IHRoaXMub25SaWdodE5hdjtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vblNlbGVjdCA9IHRoaXMub25TZWxlY3Q7XG5cbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5pbml0KCk7XG5cbiAgICAgIGlmICh0aGlzLmRhdGVQaWNrZXIuY29tcG9uZW50Q29uZmlnLmRpc2FibGVLZXlwcmVzcykge1xuICAgICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3JlYWRvbmx5Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=