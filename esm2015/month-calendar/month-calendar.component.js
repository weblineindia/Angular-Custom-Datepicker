var MonthCalendarComponent_1;
import { __decorate } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MonthCalendarService } from './month-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
let MonthCalendarComponent = MonthCalendarComponent_1 = class MonthCalendarComponent {
    constructor(monthCalendarService, utilsService, cd) {
        this.monthCalendarService = monthCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.isInited = false;
        this._shouldShowCurrent = true;
        this.api = {
            toggleCalendar: this.toggleCalendarMode.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(current) {
        this._currentDateView = current.clone();
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView);
        this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
        this.showRightNav = this.monthCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
        this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation && this.showLeftNav;
        this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation && this.showRightNav;
    }
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    init() {
        this.componentConfig = this.monthCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.displayDate
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'month');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    monthClicked(month) {
        if (month.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, month, 'month');
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(month);
    }
    onLeftNavClick() {
        const from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(1, 'year');
        const to = this.currentDateView.clone();
        this.yearMonths = this.monthCalendarService.generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onLeftNav.emit({ from, to });
    }
    onLeftSecondaryNavClick() {
        let navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const isOutsideRange = this.componentConfig.min &&
            this.currentDateView.year() - this.componentConfig.min.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.currentDateView.year() - this.componentConfig.min.year();
        }
        const from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(navigateBy, 'year');
        const to = this.currentDateView.clone();
        this.onLeftSecondaryNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(1, 'year');
        const to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    onRightSecondaryNavClick() {
        let navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const isOutsideRange = this.componentConfig.max &&
            this.componentConfig.max.year() - this.currentDateView.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.componentConfig.max.year() - this.currentDateView.year();
        }
        const from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(navigateBy, 'year');
        const to = this.currentDateView.clone();
        this.onRightSecondaryNav.emit({ from, to });
    }
    toggleCalendarMode() {
        this.onNavHeaderBtnClick.emit();
    }
    getMonthBtnCssClass(month) {
        const cssClass = {
            'dp-selected': month.selected,
            'dp-current-month': month.currentMonth
        };
        const customCssClass = this.monthCalendarService.getMonthBtnCssClass(this.componentConfig, month.date);
        if (customCssClass) {
            cssClass[customCssClass] = true;
        }
        return cssClass;
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'month', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
            this.cd.markForCheck();
        }
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.monthCalendarService.getConfig(config.previousValue);
            const currentConf = this.monthCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf.locale);
                }
                (this.selected || []).forEach((m) => m.locale(currentConf.locale));
            }
        }
    }
};
MonthCalendarComponent.ctorParameters = () => [
    { type: MonthCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], MonthCalendarComponent.prototype, "config", void 0);
__decorate([
    Input()
], MonthCalendarComponent.prototype, "displayDate", void 0);
__decorate([
    Input()
], MonthCalendarComponent.prototype, "minDate", void 0);
__decorate([
    Input()
], MonthCalendarComponent.prototype, "maxDate", void 0);
__decorate([
    HostBinding('class'), Input()
], MonthCalendarComponent.prototype, "theme", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onSelect", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onNavHeaderBtnClick", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onGoToCurrent", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onLeftNav", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onRightNav", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onLeftSecondaryNav", void 0);
__decorate([
    Output()
], MonthCalendarComponent.prototype, "onRightSecondaryNav", void 0);
MonthCalendarComponent = MonthCalendarComponent_1 = __decorate([
    Component({
        selector: 'dp-month-calendar',
        template: "<div class=\"dp-month-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode()\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onLeftSecondaryNav)=\"onLeftSecondaryNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      (onRightSecondaryNav)=\"onRightSecondaryNavClick()\"\n      [isLabelClickable]=\"componentConfig.isNavHeaderBtnClickable\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"shouldShowCurrent()\"\n      [showLeftNav]=\"showLeftNav\"\n      [showLeftSecondaryNav]=\"showSecondaryLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [showRightSecondaryNav]=\"showSecondaryRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div class=\"dp-calendar-wrapper\">\n    <div *ngFor=\"let monthRow of yearMonths\" class=\"dp-months-row\">\n      <button (click)=\"monthClicked(month)\"\n              *ngFor=\"let month of monthRow\"\n              [attr.data-date]=\"month.date.format(componentConfig.format)\"\n              [disabled]=\"month.disabled\"\n              [innerText]=\"month.text\"\n              [ngClass]=\"getMonthBtnCssClass(month)\"\n              class=\"dp-calendar-month\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            MonthCalendarService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => MonthCalendarComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => MonthCalendarComponent_1),
                multi: true
            }
        ],
        styles: ["dp-month-calendar{display:inline-block}dp-month-calendar .dp-month-calendar-container{background:#fff}dp-month-calendar .dp-calendar-wrapper{border:1px solid #000}dp-month-calendar .dp-calendar-month{box-sizing:border-box;width:52.5px;height:52.5px;cursor:pointer}dp-month-calendar .dp-calendar-month.dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;background:#e0e0e0;border:1px solid #e0e0e0}dp-month-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-month-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-month-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-month-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-month-calendar.dp-material .dp-current-month{border:1px solid #106cc8}"]
    })
], MonthCalendarComponent);
export { MonthCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsibW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUduQyxPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUtwRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFzQnhCLElBQWEsc0JBQXNCLDhCQUFuQyxNQUFhLHNCQUFzQjtJQTBEakMsWUFBNEIsb0JBQTBDLEVBQzFDLFlBQTBCLEVBQzFCLEVBQXFCO1FBRnJCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUE3QnZDLGFBQVEsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNwRCx3QkFBbUIsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3RCxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxlQUFVLEdBQTRCLElBQUksWUFBWSxFQUFF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QUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUFzQixDQUFDO2dCQUNyRCxLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsd0JBQXNCLENBQUM7Z0JBQ3JELEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjs7S0FDRixDQUFDO0dBQ1csc0JBQXNCLENBMFFsQztTQTFRWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0lNb250aH0gZnJvbSAnLi9tb250aC5tb2RlbCc7XG5pbXBvcnQge01vbnRoQ2FsZW5kYXJTZXJ2aWNlfSBmcm9tICcuL21vbnRoLWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtJTW9udGhDYWxlbmRhckNvbmZpZywgSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbH0gZnJvbSAnLi9tb250aC1jYWxlbmRhci1jb25maWcnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Db250cm9sLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgVmFsaWRhdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge1NpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zaW5nbGUtY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtJTmF2RXZlbnR9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvbmF2aWdhdGlvbi1ldmVudC5tb2RlbCc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudE5zO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1tb250aC1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnbW9udGgtY2FsZW5kYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnbW9udGgtY2FsZW5kYXIuY29tcG9uZW50Lmxlc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIE1vbnRoQ2FsZW5kYXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTW9udGhDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1vbnRoQ2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTW9udGhDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogTW9tZW50W10pIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKSk7XG4gIH1cblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoY3VycmVudDogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gY3VycmVudC5jbG9uZSgpO1xuICAgIHRoaXMueWVhck1vbnRocyA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZVllYXIodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX2N1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5uYXZMYWJlbCA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2UuZ2V0SGVhZGVyTGFiZWwodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgICB0aGlzLnNob3dMZWZ0TmF2ID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5zaG91bGRTaG93TGVmdCh0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sIHRoaXMuX2N1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93UmlnaHROYXYgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLnNob3VsZFNob3dSaWdodCh0aGlzLmNvbXBvbmVudENvbmZpZy5tYXgsIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgICB0aGlzLnNob3dTZWNvbmRhcnlMZWZ0TmF2ID0gdGhpcy5jb21wb25lbnRDb25maWcuc2hvd011bHRpcGxlWWVhcnNOYXZpZ2F0aW9uICYmIHRoaXMuc2hvd0xlZnROYXY7XG4gICAgdGhpcy5zaG93U2Vjb25kYXJ5UmlnaHROYXYgPSB0aGlzLmNvbXBvbmVudENvbmZpZy5zaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb24gJiYgdGhpcy5zaG93UmlnaHROYXY7XG4gIH1cblxuICBASW5wdXQoKSBjb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogTW9tZW50O1xuICBASW5wdXQoKSBtaW5EYXRlOiBNb21lbnQ7XG4gIEBJbnB1dCgpIG1heERhdGU6IE1vbWVudDtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElNb250aD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbk5hdkhlYWRlckJ0bkNsaWNrOiBFdmVudEVtaXR0ZXI8bnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodFNlY29uZGFyeU5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGlzSW5pdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbXBvbmVudENvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbDtcbiAgeWVhck1vbnRoczogSU1vbnRoW11bXTtcbiAgaW5wdXRWYWx1ZTogQ2FsZW5kYXJWYWx1ZTtcbiAgaW5wdXRWYWx1ZVR5cGU6IEVDYWxlbmRhclZhbHVlO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBfc2hvdWxkU2hvd0N1cnJlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuICBuYXZMYWJlbDogc3RyaW5nO1xuICBzaG93TGVmdE5hdjogYm9vbGVhbjtcbiAgc2hvd1JpZ2h0TmF2OiBib29sZWFuO1xuICBzaG93U2Vjb25kYXJ5TGVmdE5hdjogYm9vbGVhbjtcbiAgc2hvd1NlY29uZGFyeVJpZ2h0TmF2OiBib29sZWFuO1xuICBhcGkgPSB7XG4gICAgdG9nZ2xlQ2FsZW5kYXI6IHRoaXMudG9nZ2xlQ2FsZW5kYXJNb2RlLmJpbmQodGhpcyksXG4gICAgbW92ZUNhbGVuZGFyVG86IHRoaXMubW92ZUNhbGVuZGFyVG8uYmluZCh0aGlzKVxuICB9O1xuXG4gIF9zZWxlY3RlZDogTW9tZW50W107XG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbW9udGhDYWxlbmRhclNlcnZpY2U6IE1vbnRoQ2FsZW5kYXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaXNJbml0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0luaXRlZCkge1xuICAgICAgY29uc3Qge21pbkRhdGUsIG1heERhdGUsIGNvbmZpZ30gPSBjaGFuZ2VzO1xuXG4gICAgICB0aGlzLmhhbmRsZUNvbmZpZ0NoYW5nZShjb25maWcpO1xuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgIGlmIChtaW5EYXRlIHx8IG1heERhdGUpIHtcbiAgICAgICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQgfHwgW107XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmRpc3BsYXlEYXRlXG4gICAgICA/IHRoaXMuZGlzcGxheURhdGVcbiAgICAgIDogdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldERlZmF1bHREaXNwbGF5RGF0ZShcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgICk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpO1xuICAgIHRoaXMuX3Nob3VsZFNob3dDdXJyZW50ID0gdGhpcy5zaG91bGRTaG93Q3VycmVudCgpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLnllYXJNb250aHMgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlXG4gICAgICAgIC5nZW5lcmF0ZVllYXIodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgICAgdGhpcy55ZWFyTW9udGhzID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZVxuICAgICAgICAuZ2VuZXJhdGVZZWFyKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25DaGFuZ2VDYWxsYmFjayhfOiBhbnkpOiB2b2lkIHtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgfVxuXG4gIHZhbGlkYXRlKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBhbnkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZuKGZvcm1Db250cm9sLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgpID0+IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodmFsdWU6IE1vbWVudFtdKTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICB2YWx1ZSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnJldHVybmVkVmFsdWVUeXBlIHx8IHRoaXMuaW5wdXRWYWx1ZVR5cGVcbiAgICApO1xuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge21pbkRhdGU6IHRoaXMubWluRGF0ZSwgbWF4RGF0ZTogdGhpcy5tYXhEYXRlfSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgICdtb250aCdcbiAgICApO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCkpO1xuICB9XG5cbiAgbW9udGhDbGlja2VkKG1vbnRoOiBJTW9udGgpOiB2b2lkIHtcbiAgICBpZiAobW9udGguc2VsZWN0ZWQgJiYgIXRoaXMuY29tcG9uZW50Q29uZmlnLnVuU2VsZWN0T25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgLnVwZGF0ZVNlbGVjdGVkKHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsIHRoaXMuc2VsZWN0ZWQsIG1vbnRoLCAnbW9udGgnKTtcbiAgICB0aGlzLnllYXJNb250aHMgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVZZWFyKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5vblNlbGVjdC5lbWl0KG1vbnRoKTtcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKCkge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKS5zdWJ0cmFjdCgxLCAneWVhcicpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLnllYXJNb250aHMgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLmdlbmVyYXRlWWVhcih0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvbkxlZnRTZWNvbmRhcnlOYXZDbGljaygpOiB2b2lkIHtcbiAgICBsZXQgbmF2aWdhdGVCeSA9IHRoaXMuY29tcG9uZW50Q29uZmlnLm11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5O1xuICAgIGNvbnN0IGlzT3V0c2lkZVJhbmdlID0gdGhpcy5jb21wb25lbnRDb25maWcubWluICYmXG4gICAgICB0aGlzLmN1cnJlbnREYXRlVmlldy55ZWFyKCkgLSB0aGlzLmNvbXBvbmVudENvbmZpZy5taW4ueWVhcigpIDwgbmF2aWdhdGVCeTtcblxuICAgIGlmIChpc091dHNpZGVSYW5nZSkge1xuICAgICAgbmF2aWdhdGVCeSA9IHRoaXMuY3VycmVudERhdGVWaWV3LnllYXIoKSAtIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pbi55ZWFyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpLnN1YnRyYWN0KG5hdmlnYXRlQnksICd5ZWFyJyk7XG4gICAgY29uc3QgdG8gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMub25MZWZ0U2Vjb25kYXJ5TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soKTogdm9pZCB7XG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpLmFkZCgxLCAneWVhcicpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdCh7ZnJvbSwgdG99KTtcbiAgfVxuXG4gIG9uUmlnaHRTZWNvbmRhcnlOYXZDbGljaygpOiB2b2lkIHtcbiAgICBsZXQgbmF2aWdhdGVCeSA9IHRoaXMuY29tcG9uZW50Q29uZmlnLm11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5O1xuICAgIGNvbnN0IGlzT3V0c2lkZVJhbmdlID0gdGhpcy5jb21wb25lbnRDb25maWcubWF4ICYmXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5tYXgueWVhcigpIC0gdGhpcy5jdXJyZW50RGF0ZVZpZXcueWVhcigpIDwgbmF2aWdhdGVCeTtcblxuICAgIGlmIChpc091dHNpZGVSYW5nZSkge1xuICAgICAgbmF2aWdhdGVCeSA9IHRoaXMuY29tcG9uZW50Q29uZmlnLm1heC55ZWFyKCkgLSB0aGlzLmN1cnJlbnREYXRlVmlldy55ZWFyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpLmFkZChuYXZpZ2F0ZUJ5LCAneWVhcicpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uUmlnaHRTZWNvbmRhcnlOYXYuZW1pdCh7ZnJvbSwgdG99KTtcbiAgfVxuXG4gIHRvZ2dsZUNhbGVuZGFyTW9kZSgpOiB2b2lkIHtcbiAgICB0aGlzLm9uTmF2SGVhZGVyQnRuQ2xpY2suZW1pdCgpO1xuICB9XG5cbiAgZ2V0TW9udGhCdG5Dc3NDbGFzcyhtb250aDogSU1vbnRoKToge1trbGFzczogc3RyaW5nXTogYm9vbGVhbn0ge1xuICAgIGNvbnN0IGNzc0NsYXNzOiB7W2tsYXNzOiBzdHJpbmddOiBib29sZWFufSA9IHtcbiAgICAgICdkcC1zZWxlY3RlZCc6IG1vbnRoLnNlbGVjdGVkLFxuICAgICAgJ2RwLWN1cnJlbnQtbW9udGgnOiBtb250aC5jdXJyZW50TW9udGhcbiAgICB9O1xuICAgIGNvbnN0IGN1c3RvbUNzc0NsYXNzOiBzdHJpbmcgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLmdldE1vbnRoQnRuQ3NzQ2xhc3ModGhpcy5jb21wb25lbnRDb25maWcsIG1vbnRoLmRhdGUpO1xuXG4gICAgaWYgKGN1c3RvbUNzc0NsYXNzKSB7XG4gICAgICBjc3NDbGFzc1tjdXN0b21Dc3NDbGFzc10gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBjc3NDbGFzcztcbiAgfVxuXG4gIHNob3VsZFNob3dDdXJyZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5zaG91bGRTaG93Q3VycmVudChcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnNob3dHb1RvQ3VycmVudCxcbiAgICAgICdtb250aCcsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5tYXhcbiAgICApO1xuICB9XG5cbiAgZ29Ub0N1cnJlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb21lbnQoKTtcbiAgICB0aGlzLm9uR29Ub0N1cnJlbnQuZW1pdCgpO1xuICB9XG5cbiAgbW92ZUNhbGVuZGFyVG8odG86IFNpbmdsZUNhbGVuZGFyVmFsdWUpOiB2b2lkIHtcbiAgICBpZiAodG8pIHtcbiAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KHRvLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnOiBTaW1wbGVDaGFuZ2UpOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBjb25zdCBwcmV2Q29uZjogSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb25mOiBJTW9udGhDYWxlbmRhckNvbmZpZ0ludGVybmFsID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5nZXRDb25maWcoY29uZmlnLmN1cnJlbnRWYWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLnV0aWxzU2VydmljZS5zaG91bGRSZXNldEN1cnJlbnRWaWV3KHByZXZDb25mLCBjdXJyZW50Q29uZikpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZDb25mLmxvY2FsZSAhPT0gY3VycmVudENvbmYubG9jYWxlKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnREYXRlVmlldykge1xuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LmxvY2FsZShjdXJyZW50Q29uZi5sb2NhbGUpXG4gICAgICAgIH1cblxuICAgICAgICAodGhpcy5zZWxlY3RlZCB8fCBbXSkuZm9yRWFjaCgobSkgPT4gbS5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=