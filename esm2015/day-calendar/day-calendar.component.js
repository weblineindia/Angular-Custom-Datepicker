var DayCalendarComponent_1;
import { __decorate } from "tslib";
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
let DayCalendarComponent = DayCalendarComponent_1 = class DayCalendarComponent {
    constructor(dayCalendarService, utilsService, cd) {
        this.dayCalendarService = dayCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.CalendarMode = ECalendarMode;
        this.isInited = false;
        this.currentCalendarMode = ECalendarMode.Day;
        this._shouldShowCurrent = true;
        this.api = {
            moveCalendarsBy: this.moveCalendarsBy.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this),
            toggleCalendarMode: this.toggleCalendarMode.bind(this)
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
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
        this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
        this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.weekdays = this.dayCalendarService
            .generateWeekdays(this.componentConfig.firstDayOfWeek);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
        this._shouldShowCurrent = this.shouldShowCurrent();
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
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
        }
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
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
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dayClicked(day) {
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    }
    getDayBtnText(day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    }
    getDayBtnCssClass(day) {
        const cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        const customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    }
    onLeftNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        const to = this.currentDateView.clone();
        this.onLeftNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        const to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    onMonthCalendarLeftClick(change) {
        this.onLeftNav.emit(change);
    }
    onMonthCalendarRightClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryLeftClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryRightClick(change) {
        this.onLeftNav.emit(change);
    }
    getWeekdayName(weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    }
    toggleCalendarMode(mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    }
    monthSelected(month) {
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.onMonthSelect.emit(month);
    }
    moveCalendarsBy(current, amount, granularity = 'month') {
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.dayCalendarService.getConfig(config.previousValue);
            const currentConf = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf.locale);
                }
                this.selected.forEach(m => m.locale(currentConf.locale));
            }
        }
    }
};
DayCalendarComponent.ctorParameters = () => [
    { type: DayCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], DayCalendarComponent.prototype, "config", void 0);
__decorate([
    Input()
], DayCalendarComponent.prototype, "displayDate", void 0);
__decorate([
    Input()
], DayCalendarComponent.prototype, "minDate", void 0);
__decorate([
    Input()
], DayCalendarComponent.prototype, "maxDate", void 0);
__decorate([
    HostBinding('class'), Input()
], DayCalendarComponent.prototype, "theme", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onSelect", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onMonthSelect", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onNavHeaderBtnClick", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onGoToCurrent", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onLeftNav", void 0);
__decorate([
    Output()
], DayCalendarComponent.prototype, "onRightNav", void 0);
DayCalendarComponent = DayCalendarComponent_1 = __decorate([
    Component({
        selector: 'dp-day-calendar',
        template: "<div *ngIf=\"currentCalendarMode ===  CalendarMode.Day\" class=\"dp-day-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentCalendarMode ===  CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            DayCalendarService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DayCalendarComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DayCalendarComponent_1),
                multi: true
            }
        ],
        styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000;border-bottom:1px solid #000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-next-month,dp-day-calendar .dp-prev-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-next-month,dp-day-calendar .dp-hide-near-month .dp-prev-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-day-calendar.dp-material .dp-calendar-day,dp-day-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-day-calendar.dp-material .dp-calendar-day:hover,dp-day-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106cc8}"]
    })
], DayCalendarComponent);
export { DayCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2pFLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sWUFBWSxFQUNaLGFBQWEsRUFDYixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFJbkMsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFHbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFNcEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBc0J4QixJQUFhLG9CQUFvQiw0QkFBakMsTUFBYSxvQkFBb0I7SUEyRC9CLFlBQTRCLGtCQUFzQyxFQUN0QyxZQUEwQixFQUMxQixFQUFxQjtRQUZyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBL0J2QyxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsa0JBQWEsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCx3QkFBbUIsR0FBZ0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RSxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFB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RSxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBb0IsQ0FBQztnQkFDbkQsS0FBSyxFQUFFLElBQUk7YUFDWjtTQUNGOztLQUNGLENBQUM7R0FDVyxvQkFBb0IsQ0E4UmhDO1NBOVJZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge0VDYWxlbmRhck1vZGV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlLWVudW0nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXlDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4vZGF5LWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50LCB1bml0T2ZUaW1lfSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtJRGF5Q2FsZW5kYXJDb25maWcsIElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsfSBmcm9tICcuL2RheS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtJRGF5fSBmcm9tICcuL2RheS5tb2RlbCc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SU1vbnRoQ2FsZW5kYXJDb25maWd9IGZyb20gJy4uL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLWNvbmZpZyc7XG5pbXBvcnQge0lNb250aH0gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgubW9kZWwnO1xuaW1wb3J0IHtEYXRlVmFsaWRhdG9yfSBmcm9tICcuLi9jb21tb24vdHlwZXMvdmFsaWRhdG9yLnR5cGUnO1xuaW1wb3J0IHtJTmF2RXZlbnR9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvbmF2aWdhdGlvbi1ldmVudC5tb2RlbCc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudE5zO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1kYXktY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2RheS1jYWxlbmRhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXktY2FsZW5kYXIuY29tcG9uZW50Lmxlc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheUNhbGVuZGFyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5Q2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRGF5Q2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZCkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnREYXRlVmlldygpOiBNb21lbnQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50RGF0ZVZpZXc7XG4gIH1cblxuICBzZXQgY3VycmVudERhdGVWaWV3KGN1cnJlbnQ6IE1vbWVudCkge1xuICAgIHRoaXMuX2N1cnJlbnREYXRlVmlldyA9IGN1cnJlbnQuY2xvbmUoKTtcbiAgICB0aGlzLndlZWtzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZU1vbnRoQXJyYXkodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX2N1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5uYXZMYWJlbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldEhlYWRlckxhYmVsKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9jdXJyZW50RGF0ZVZpZXcpO1xuICAgIHRoaXMuc2hvd0xlZnROYXYgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5zaG91bGRTaG93TGVmdCh0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgICB0aGlzLnNob3dSaWdodE5hdiA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLnNob3VsZFNob3dSaWdodCh0aGlzLmNvbXBvbmVudENvbmZpZy5tYXgsIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgfVxuICA7XG5cbiAgQElucHV0KCkgY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWc7XG4gIEBJbnB1dCgpIGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5EYXRlOiBNb21lbnQ7XG4gIEBJbnB1dCgpIG1heERhdGU6IE1vbWVudDtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElEYXk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Nb250aFNlbGVjdDogRXZlbnRFbWl0dGVyPElNb250aD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbk5hdkhlYWRlckJ0bkNsaWNrOiBFdmVudEVtaXR0ZXI8RUNhbGVuZGFyTW9kZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIENhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGU7XG4gIGlzSW5pdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbXBvbmVudENvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWw7XG4gIHdlZWtzOiBJRGF5W11bXTtcbiAgd2Vla2RheXM6IE1vbWVudFtdO1xuICBpbnB1dFZhbHVlOiBDYWxlbmRhclZhbHVlO1xuICBpbnB1dFZhbHVlVHlwZTogRUNhbGVuZGFyVmFsdWU7XG4gIHZhbGlkYXRlRm46IERhdGVWYWxpZGF0b3I7XG4gIGN1cnJlbnRDYWxlbmRhck1vZGU6IEVDYWxlbmRhck1vZGUgPSBFQ2FsZW5kYXJNb2RlLkRheTtcbiAgbW9udGhDYWxlbmRhckNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWc7XG4gIF9zaG91bGRTaG93Q3VycmVudDogYm9vbGVhbiA9IHRydWU7XG4gIG5hdkxhYmVsOiBzdHJpbmc7XG4gIHNob3dMZWZ0TmF2OiBib29sZWFuO1xuICBzaG93UmlnaHROYXY6IGJvb2xlYW47XG4gIGFwaSA9IHtcbiAgICBtb3ZlQ2FsZW5kYXJzQnk6IHRoaXMubW92ZUNhbGVuZGFyc0J5LmJpbmQodGhpcyksXG4gICAgbW92ZUNhbGVuZGFyVG86IHRoaXMubW92ZUNhbGVuZGFyVG8uYmluZCh0aGlzKSxcbiAgICB0b2dnbGVDYWxlbmRhck1vZGU6IHRoaXMudG9nZ2xlQ2FsZW5kYXJNb2RlLmJpbmQodGhpcylcbiAgfTtcblxuICBfc2VsZWN0ZWQ6IE1vbWVudFtdO1xuICBfY3VycmVudERhdGVWaWV3OiBNb21lbnQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGRheUNhbGVuZGFyU2VydmljZTogRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaXNJbml0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkIHx8IFtdO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5kaXNwbGF5RGF0ZVxuICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodGhpcy5kaXNwbGF5RGF0ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KS5jbG9uZSgpXG4gICAgICA6IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApO1xuICAgIHRoaXMud2Vla2RheXMgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlV2Vla2RheXModGhpcy5jb21wb25lbnRDb25maWcuZmlyc3REYXlPZldlZWspO1xuICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0KTtcbiAgICB0aGlzLm1vbnRoQ2FsZW5kYXJDb25maWcgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRNb250aENhbGVuZGFyQ29uZmlnKHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICB0aGlzLl9zaG91bGRTaG93Q3VycmVudCA9IHRoaXMuc2hvdWxkU2hvd0N1cnJlbnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5pc0luaXRlZCkge1xuICAgICAgY29uc3Qge21pbkRhdGUsIG1heERhdGUsIGNvbmZpZ30gPSBjaGFuZ2VzO1xuXG4gICAgICB0aGlzLmhhbmRsZUNvbmZpZ0NoYW5nZShjb25maWcpO1xuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgIGlmIChtaW5EYXRlIHx8IG1heERhdGUpIHtcbiAgICAgICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IENhbGVuZGFyVmFsdWUpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5jb252ZXJ0VG9Nb21lbnRBcnJheSh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMud2Vla3MgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlTW9udGhBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25DaGFuZ2VDYWxsYmFjayhfOiBhbnkpIHtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgfVxuXG4gIHZhbGlkYXRlKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBhbnkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZuKGZvcm1Db250cm9sLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgpID0+IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodmFsdWU6IE1vbWVudFtdKTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICB2YWx1ZSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnJldHVybmVkVmFsdWVUeXBlIHx8IHRoaXMuaW5wdXRWYWx1ZVR5cGVcbiAgICApO1xuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKSB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge21pbkRhdGU6IHRoaXMubWluRGF0ZSwgbWF4RGF0ZTogdGhpcy5tYXhEYXRlfSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgICdkYXknXG4gICAgKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIGRheUNsaWNrZWQoZGF5OiBJRGF5KSB7XG4gICAgaWYgKGRheS5zZWxlY3RlZCAmJiAhdGhpcy5jb21wb25lbnRDb25maWcudW5TZWxlY3RPbkNsaWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAudXBkYXRlU2VsZWN0ZWQodGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCwgdGhpcy5zZWxlY3RlZCwgZGF5KTtcbiAgICB0aGlzLndlZWtzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZU1vbnRoQXJyYXkodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQoZGF5KTtcbiAgfVxuXG4gIGdldERheUJ0blRleHQoZGF5OiBJRGF5KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0RGF5QnRuVGV4dCh0aGlzLmNvbXBvbmVudENvbmZpZywgZGF5LmRhdGUpO1xuICB9XG5cbiAgZ2V0RGF5QnRuQ3NzQ2xhc3MoZGF5OiBJRGF5KToge1trbGFzczogc3RyaW5nXTogYm9vbGVhbn0ge1xuICAgIGNvbnN0IGNzc0NsYXNzZXM6IHtba2xhc3M6IHN0cmluZ106IGJvb2xlYW59ID0ge1xuICAgICAgJ2RwLXNlbGVjdGVkJzogZGF5LnNlbGVjdGVkLFxuICAgICAgJ2RwLWN1cnJlbnQtbW9udGgnOiBkYXkuY3VycmVudE1vbnRoLFxuICAgICAgJ2RwLXByZXYtbW9udGgnOiBkYXkucHJldk1vbnRoLFxuICAgICAgJ2RwLW5leHQtbW9udGgnOiBkYXkubmV4dE1vbnRoLFxuICAgICAgJ2RwLWN1cnJlbnQtZGF5JzogZGF5LmN1cnJlbnREYXlcbiAgICB9O1xuICAgIGNvbnN0IGN1c3RvbUNzc0NsYXNzOiBzdHJpbmcgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXREYXlCdG5Dc3NDbGFzcyh0aGlzLmNvbXBvbmVudENvbmZpZywgZGF5LmRhdGUpO1xuICAgIGlmIChjdXN0b21Dc3NDbGFzcykge1xuICAgICAgY3NzQ2xhc3Nlc1tjdXN0b21Dc3NDbGFzc10gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBjc3NDbGFzc2VzO1xuICB9XG5cbiAgb25MZWZ0TmF2Q2xpY2soKSB7XG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5tb3ZlQ2FsZW5kYXJzQnkodGhpcy5jdXJyZW50RGF0ZVZpZXcsIC0xLCAnbW9udGgnKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdCh7ZnJvbSwgdG99KTtcbiAgfVxuXG4gIG9uUmlnaHROYXZDbGljaygpIHtcbiAgICBjb25zdCBmcm9tID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm1vdmVDYWxlbmRhcnNCeSh0aGlzLmN1cnJlbnREYXRlVmlldywgMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgdG8gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMub25SaWdodE5hdi5lbWl0KHtmcm9tLCB0b30pO1xuICB9XG5cbiAgb25Nb250aENhbGVuZGFyTGVmdENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25Nb250aENhbGVuZGFyUmlnaHRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25SaWdodE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJTZWNvbmRhcnlMZWZ0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25Nb250aENhbGVuZGFyU2Vjb25kYXJ5UmlnaHRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIGdldFdlZWtkYXlOYW1lKHdlZWtkYXk6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50Q29uZmlnLndlZWtEYXlGb3JtYXR0ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy53ZWVrRGF5Rm9ybWF0dGVyKHdlZWtkYXkuZGF5KCkpO1xuICAgIH1cblxuICAgIHJldHVybiB3ZWVrZGF5LmZvcm1hdCh0aGlzLmNvbXBvbmVudENvbmZpZy53ZWVrRGF5Rm9ybWF0KTtcbiAgfVxuXG4gIHRvZ2dsZUNhbGVuZGFyTW9kZShtb2RlOiBFQ2FsZW5kYXJNb2RlKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSAhPT0gbW9kZSkge1xuICAgICAgdGhpcy5jdXJyZW50Q2FsZW5kYXJNb2RlID0gbW9kZTtcbiAgICAgIHRoaXMub25OYXZIZWFkZXJCdG5DbGljay5lbWl0KG1vZGUpO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBtb250aFNlbGVjdGVkKG1vbnRoOiBJTW9udGgpIHtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IG1vbnRoLmRhdGUuY2xvbmUoKTtcbiAgICB0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUgPSBFQ2FsZW5kYXJNb2RlLkRheTtcbiAgICB0aGlzLm9uTW9udGhTZWxlY3QuZW1pdChtb250aCk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJzQnkoY3VycmVudDogTW9tZW50LCBhbW91bnQ6IG51bWJlciwgZ3JhbnVsYXJpdHk6IHVuaXRPZlRpbWUuQmFzZSA9ICdtb250aCcpIHtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IGN1cnJlbnQuY2xvbmUoKS5hZGQoYW1vdW50LCBncmFudWxhcml0eSk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG1vdmVDYWxlbmRhclRvKHRvOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgaWYgKHRvKSB7XG4gICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0bywgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc2hvdWxkU2hvd0N1cnJlbnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLnNob3VsZFNob3dDdXJyZW50KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuc2hvd0dvVG9DdXJyZW50LFxuICAgICAgJ2RheScsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5tYXhcbiAgICApO1xuICB9XG5cbiAgZ29Ub0N1cnJlbnQoKSB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb21lbnQoKTtcbiAgICB0aGlzLm9uR29Ub0N1cnJlbnQuZW1pdCgpO1xuICB9XG5cbiAgaGFuZGxlQ29uZmlnQ2hhbmdlKGNvbmZpZzogU2ltcGxlQ2hhbmdlKSB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgY29uc3QgcHJldkNvbmY6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcuY3VycmVudFZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMudXRpbHNTZXJ2aWNlLnNob3VsZFJlc2V0Q3VycmVudFZpZXcocHJldkNvbmYsIGN1cnJlbnRDb25mKSkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RGF0ZVZpZXcgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldkNvbmYubG9jYWxlICE9PSBjdXJyZW50Q29uZi5sb2NhbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudERhdGVWaWV3KSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcubG9jYWxlKGN1cnJlbnRDb25mLmxvY2FsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmZvckVhY2gobSA9PiBtLmxvY2FsZShjdXJyZW50Q29uZi5sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==