import { __decorate } from "tslib";
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var moment = momentNs;
var DayCalendarComponent = /** @class */ (function () {
    function DayCalendarComponent(dayCalendarService, utilsService, cd) {
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
    DayCalendarComponent_1 = DayCalendarComponent;
    Object.defineProperty(DayCalendarComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.onChangeCallback(this.processOnChangeCallback(selected));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DayCalendarComponent.prototype, "currentDateView", {
        get: function () {
            return this._currentDateView;
        },
        set: function (current) {
            this._currentDateView = current.clone();
            this.weeks = this.dayCalendarService
                .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
            this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
            this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
            this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
        },
        enumerable: true,
        configurable: true
    });
    ;
    DayCalendarComponent.prototype.ngOnInit = function () {
        this.isInited = true;
        this.init();
        this.initValidators();
    };
    DayCalendarComponent.prototype.init = function () {
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
    };
    DayCalendarComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInited) {
            var minDate = changes.minDate, maxDate = changes.maxDate, config = changes.config;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    };
    DayCalendarComponent.prototype.writeValue = function (value) {
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
    };
    DayCalendarComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DayCalendarComponent.prototype.onChangeCallback = function (_) {
    };
    DayCalendarComponent.prototype.registerOnTouched = function (fn) {
    };
    DayCalendarComponent.prototype.validate = function (formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return function () { return null; };
        }
    };
    DayCalendarComponent.prototype.processOnChangeCallback = function (value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    };
    DayCalendarComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    };
    DayCalendarComponent.prototype.dayClicked = function (day) {
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    };
    DayCalendarComponent.prototype.getDayBtnText = function (day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    };
    DayCalendarComponent.prototype.getDayBtnCssClass = function (day) {
        var cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        var customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    };
    DayCalendarComponent.prototype.onLeftNavClick = function () {
        var from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        var to = this.currentDateView.clone();
        this.onLeftNav.emit({ from: from, to: to });
    };
    DayCalendarComponent.prototype.onRightNavClick = function () {
        var from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        var to = this.currentDateView.clone();
        this.onRightNav.emit({ from: from, to: to });
    };
    DayCalendarComponent.prototype.onMonthCalendarLeftClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarRightClick = function (change) {
        this.onRightNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarSecondaryLeftClick = function (change) {
        this.onRightNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarSecondaryRightClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DayCalendarComponent.prototype.getWeekdayName = function (weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    };
    DayCalendarComponent.prototype.toggleCalendarMode = function (mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.monthSelected = function (month) {
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.onMonthSelect.emit(month);
    };
    DayCalendarComponent.prototype.moveCalendarsBy = function (current, amount, granularity) {
        if (granularity === void 0) { granularity = 'month'; }
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.moveCalendarTo = function (to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.shouldShowCurrent = function () {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    };
    DayCalendarComponent.prototype.goToCurrent = function () {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    };
    DayCalendarComponent.prototype.handleConfigChange = function (config) {
        if (config) {
            var prevConf = this.dayCalendarService.getConfig(config.previousValue);
            var currentConf_1 = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf_1)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf_1.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf_1.locale);
                }
                this.selected.forEach(function (m) { return m.locale(currentConf_1.locale); });
            }
        }
    };
    var DayCalendarComponent_1;
    DayCalendarComponent.ctorParameters = function () { return [
        { type: DayCalendarService },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
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
                    useExisting: forwardRef(function () { return DayCalendarComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return DayCalendarComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000;border-bottom:1px solid #000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-next-month,dp-day-calendar .dp-prev-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-next-month,dp-day-calendar .dp-hide-near-month .dp-prev-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-day-calendar.dp-material .dp-calendar-day,dp-day-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-day-calendar.dp-material .dp-calendar-day:hover,dp-day-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106cc8}"]
        })
    ], DayCalendarComponent);
    return DayCalendarComponent;
}());
export { DayCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDakUsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUluQyxPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQU1wRSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFzQnhCO0lBMkRFLDhCQUE0QixrQkFBc0MsRUFDdEMsWUFBMEIsRUFDMUIsRUFBcUI7UUFGckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQS9CdkMsYUFBUSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xELGtCQUFhLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDekQsd0JBQW1CLEdBQWdDLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEUsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2RCxjQUFTLEdBQTRCLElBQUksWUFB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LGlCQUFpQixDQUFDLElBQUk7WUFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsU0FBUyxFQUFFO2dCQUNULGtCQUFrQjtnQkFDbEI7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQW9CLEVBQXBCLENBQW9CLENBQUM7b0JBQ25ELEtBQUssRUFBRSxJQUFJO2lCQUNaO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxhQUFhO29CQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBb0IsRUFBcEIsQ0FBb0IsQ0FBQztvQkFDbkQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjs7U0FDRixDQUFDO09BQ1csb0JBQW9CLENBOFJoQztJQUFELDJCQUFDO0NBQUEsQUE5UkQsSUE4UkM7U0E5Ulksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlLWVudW0nO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7RUNhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUtZW51bSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi9kYXktY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBtb21lbnROcyBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtNb21lbnQsIHVuaXRPZlRpbWV9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZywgSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0lEYXl9IGZyb20gJy4vZGF5Lm1vZGVsJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJTW9udGhDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXItY29uZmlnJztcbmltcG9ydCB7SU1vbnRofSBmcm9tICcuLi9tb250aC1jYWxlbmRhci9tb250aC5tb2RlbCc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRheS1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RheS1jYWxlbmRhci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5Q2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXlDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXlDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogTW9tZW50W10pIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKSk7XG4gIH1cblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoY3VycmVudDogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gY3VycmVudC5jbG9uZSgpO1xuICAgIHRoaXMud2Vla3MgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlTW9udGhBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLm5hdkxhYmVsID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0SGVhZGVyTGFiZWwodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX2N1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93TGVmdE5hdiA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLnNob3VsZFNob3dMZWZ0KHRoaXMuY29tcG9uZW50Q29uZmlnLm1pbiwgdGhpcy5jdXJyZW50RGF0ZVZpZXcpO1xuICAgIHRoaXMuc2hvd1JpZ2h0TmF2ID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2Uuc2hvdWxkU2hvd1JpZ2h0KHRoaXMuY29tcG9uZW50Q29uZmlnLm1heCwgdGhpcy5jdXJyZW50RGF0ZVZpZXcpO1xuICB9XG4gIDtcblxuICBASW5wdXQoKSBjb25maWc6IElEYXlDYWxlbmRhckNvbmZpZztcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IE1vbWVudDtcbiAgQElucHV0KCkgbWF4RGF0ZTogTW9tZW50O1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8SURheT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbk1vbnRoU2VsZWN0OiBFdmVudEVtaXR0ZXI8SU1vbnRoPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTmF2SGVhZGVyQnRuQ2xpY2s6IEV2ZW50RW1pdHRlcjxFQ2FsZW5kYXJNb2RlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQ2FsZW5kYXJNb2RlID0gRUNhbGVuZGFyTW9kZTtcbiAgaXNJbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29tcG9uZW50Q29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbDtcbiAgd2Vla3M6IElEYXlbXVtdO1xuICB3ZWVrZGF5czogTW9tZW50W107XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlucHV0VmFsdWVUeXBlOiBFQ2FsZW5kYXJWYWx1ZTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgY3VycmVudENhbGVuZGFyTW9kZTogRUNhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGUuRGF5O1xuICBtb250aENhbGVuZGFyQ29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZztcbiAgX3Nob3VsZFNob3dDdXJyZW50OiBib29sZWFuID0gdHJ1ZTtcbiAgbmF2TGFiZWw6IHN0cmluZztcbiAgc2hvd0xlZnROYXY6IGJvb2xlYW47XG4gIHNob3dSaWdodE5hdjogYm9vbGVhbjtcbiAgYXBpID0ge1xuICAgIG1vdmVDYWxlbmRhcnNCeTogdGhpcy5tb3ZlQ2FsZW5kYXJzQnkuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpLFxuICAgIHRvZ2dsZUNhbGVuZGFyTW9kZTogdGhpcy50b2dnbGVDYWxlbmRhck1vZGUuYmluZCh0aGlzKVxuICB9O1xuXG4gIF9zZWxlY3RlZDogTW9tZW50W107XG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZGF5Q2FsZW5kYXJTZXJ2aWNlOiBEYXlDYWxlbmRhclNlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pc0luaXRlZCA9IHRydWU7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudENvbmZpZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQgfHwgW107XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmRpc3BsYXlEYXRlXG4gICAgICA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0aGlzLmRpc3BsYXlEYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpLmNsb25lKClcbiAgICAgIDogdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldERlZmF1bHREaXNwbGF5RGF0ZShcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgICk7XG4gICAgdGhpcy53ZWVrZGF5cyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVXZWVrZGF5cyh0aGlzLmNvbXBvbmVudENvbmZpZy5maXJzdERheU9mV2Vlayk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpO1xuICAgIHRoaXMubW9udGhDYWxlbmRhckNvbmZpZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldE1vbnRoQ2FsZW5kYXJDb25maWcodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMuX3Nob3VsZFNob3dDdXJyZW50ID0gdGhpcy5zaG91bGRTaG93Q3VycmVudCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICh0aGlzLmlzSW5pdGVkKSB7XG4gICAgICBjb25zdCB7bWluRGF0ZSwgbWF4RGF0ZSwgY29uZmlnfSA9IGNoYW5nZXM7XG5cbiAgICAgIHRoaXMuaGFuZGxlQ29uZmlnQ2hhbmdlKGNvbmZpZyk7XG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgaWYgKG1pbkRhdGUgfHwgbWF4RGF0ZSkge1xuICAgICAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgfVxuXG4gICAgdGhpcy53ZWVrcyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVNb250aEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gIH1cblxuICBvbkNoYW5nZUNhbGxiYWNrKF86IGFueSkge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IGFueSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCkgPT4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh2YWx1ZTogTW9tZW50W10pOiBDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydEZyb21Nb21lbnRBcnJheShcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgIHZhbHVlLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy5pbnB1dFZhbHVlVHlwZVxuICAgICk7XG4gIH1cblxuICBpbml0VmFsaWRhdG9ycygpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm4gPSB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVWYWxpZGF0b3IoXG4gICAgICB7bWluRGF0ZTogdGhpcy5taW5EYXRlLCBtYXhEYXRlOiB0aGlzLm1heERhdGV9LFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgJ2RheSdcbiAgICApO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCkpO1xuICB9XG5cbiAgZGF5Q2xpY2tlZChkYXk6IElEYXkpIHtcbiAgICBpZiAoZGF5LnNlbGVjdGVkICYmICF0aGlzLmNvbXBvbmVudENvbmZpZy51blNlbGVjdE9uQ2xpY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgIC51cGRhdGVTZWxlY3RlZCh0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LCB0aGlzLnNlbGVjdGVkLCBkYXkpO1xuICAgIHRoaXMud2Vla3MgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlTW9udGhBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMub25TZWxlY3QuZW1pdChkYXkpO1xuICB9XG5cbiAgZ2V0RGF5QnRuVGV4dChkYXk6IElEYXkpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXREYXlCdG5UZXh0KHRoaXMuY29tcG9uZW50Q29uZmlnLCBkYXkuZGF0ZSk7XG4gIH1cblxuICBnZXREYXlCdG5Dc3NDbGFzcyhkYXk6IElEYXkpOiB7W2tsYXNzOiBzdHJpbmddOiBib29sZWFufSB7XG4gICAgY29uc3QgY3NzQ2xhc3Nlczoge1trbGFzczogc3RyaW5nXTogYm9vbGVhbn0gPSB7XG4gICAgICAnZHAtc2VsZWN0ZWQnOiBkYXkuc2VsZWN0ZWQsXG4gICAgICAnZHAtY3VycmVudC1tb250aCc6IGRheS5jdXJyZW50TW9udGgsXG4gICAgICAnZHAtcHJldi1tb250aCc6IGRheS5wcmV2TW9udGgsXG4gICAgICAnZHAtbmV4dC1tb250aCc6IGRheS5uZXh0TW9udGgsXG4gICAgICAnZHAtY3VycmVudC1kYXknOiBkYXkuY3VycmVudERheVxuICAgIH07XG4gICAgY29uc3QgY3VzdG9tQ3NzQ2xhc3M6IHN0cmluZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldERheUJ0bkNzc0NsYXNzKHRoaXMuY29tcG9uZW50Q29uZmlnLCBkYXkuZGF0ZSk7XG4gICAgaWYgKGN1c3RvbUNzc0NsYXNzKSB7XG4gICAgICBjc3NDbGFzc2VzW2N1c3RvbUNzc0NsYXNzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gIH1cblxuICBvbkxlZnROYXZDbGljaygpIHtcbiAgICBjb25zdCBmcm9tID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm1vdmVDYWxlbmRhcnNCeSh0aGlzLmN1cnJlbnREYXRlVmlldywgLTEsICdtb250aCcpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KHtmcm9tLCB0b30pO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKCkge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMubW92ZUNhbGVuZGFyc0J5KHRoaXMuY3VycmVudERhdGVWaWV3LCAxLCAnbW9udGgnKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJMZWZ0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJSaWdodENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclNlY29uZGFyeUxlZnRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25SaWdodE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJTZWNvbmRhcnlSaWdodENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgZ2V0V2Vla2RheU5hbWUod2Vla2RheTogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Q29uZmlnLndlZWtEYXlGb3JtYXR0ZXIod2Vla2RheS5kYXkoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdlZWtkYXkuZm9ybWF0KHRoaXMuY29tcG9uZW50Q29uZmlnLndlZWtEYXlGb3JtYXQpO1xuICB9XG5cbiAgdG9nZ2xlQ2FsZW5kYXJNb2RlKG1vZGU6IEVDYWxlbmRhck1vZGUpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50Q2FsZW5kYXJNb2RlICE9PSBtb2RlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUgPSBtb2RlO1xuICAgICAgdGhpcy5vbk5hdkhlYWRlckJ0bkNsaWNrLmVtaXQobW9kZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG1vbnRoU2VsZWN0ZWQobW9udGg6IElNb250aCkge1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9udGguZGF0ZS5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGUuRGF5O1xuICAgIHRoaXMub25Nb250aFNlbGVjdC5lbWl0KG1vbnRoKTtcbiAgfVxuXG4gIG1vdmVDYWxlbmRhcnNCeShjdXJyZW50OiBNb21lbnQsIGFtb3VudDogbnVtYmVyLCBncmFudWxhcml0eTogdW5pdE9mVGltZS5CYXNlID0gJ21vbnRoJykge1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gY3VycmVudC5jbG9uZSgpLmFkZChhbW91bnQsIGdyYW51bGFyaXR5KTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbW92ZUNhbGVuZGFyVG8odG86IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICBpZiAodG8pIHtcbiAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KHRvLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBzaG91bGRTaG93Q3VycmVudCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2Uuc2hvdWxkU2hvd0N1cnJlbnQoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5zaG93R29Ub0N1cnJlbnQsXG4gICAgICAnZGF5JyxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pbixcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1heFxuICAgICk7XG4gIH1cblxuICBnb1RvQ3VycmVudCgpIHtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IG1vbWVudCgpO1xuICAgIHRoaXMub25Hb1RvQ3VycmVudC5lbWl0KCk7XG4gIH1cblxuICBoYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnOiBTaW1wbGVDaGFuZ2UpIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBjb25zdCBwcmV2Q29uZjogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcoY29uZmlnLnByZXZpb3VzVmFsdWUpO1xuICAgICAgY29uc3QgY3VycmVudENvbmY6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5jdXJyZW50VmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy51dGlsc1NlcnZpY2Uuc2hvdWxkUmVzZXRDdXJyZW50VmlldyhwcmV2Q29uZiwgY3VycmVudENvbmYpKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnREYXRlVmlldyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2Q29uZi5sb2NhbGUgIT09IGN1cnJlbnRDb25mLmxvY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50RGF0ZVZpZXcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldy5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuZm9yRWFjaChtID0+IG0ubG9jYWxlKGN1cnJlbnRDb25mLmxvY2FsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19