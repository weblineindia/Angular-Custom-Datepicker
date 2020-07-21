var DatePickerComponent_1;
import { __decorate } from "tslib";
import { DomHelper } from '../common/services/dom-appender/dom-appender.service';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DatePickerService } from './date-picker.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectEvent } from '../common/types/selection-event.enum';
let DatePickerComponent = DatePickerComponent_1 = class DatePickerComponent {
    constructor(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
        this.dayPickerService = dayPickerService;
        this.domHelper = domHelper;
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.utilsService = utilsService;
        this.cd = cd;
        this.isInitialized = false;
        this.mode = 'day';
        this.placeholder = '';
        this.disabled = false;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.hideStateHelper = false;
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListenersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
        this.selectEvent = SelectEvent;
        this._areCalendarsShown = false;
        this._selected = [];
    }
    get openOnFocus() {
        return this.componentConfig.openOnFocus;
    }
    get openOnClick() {
        return this.componentConfig.openOnClick;
    }
    get areCalendarsShown() {
        return this._areCalendarsShown;
    }
    set areCalendarsShown(value) {
        if (value) {
            this.startGlobalListeners();
            this.domHelper.appendElementToPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
        else {
            this.stopGlobalListeners();
            this.dayPickerService.pickerClosed();
        }
        this._areCalendarsShown = value;
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.inputElementValue = this.utilsService
            .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
            .join(' | ');
        const val = this.processOnChangeCallback(selected);
        this.onChangeCallback(val, false);
        this.onChange.emit(val);
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(date) {
        this._currentDateView = date;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.moveCalendarTo(date);
        }
        if (this.monthCalendarRef) {
            this.monthCalendarRef.moveCalendarTo(date);
        }
        if (this.dayTimeCalendarRef) {
            this.dayTimeCalendarRef.moveCalendarTo(date);
        }
    }
    onClick() {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }
    onBodyClick() {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    }
    onScroll() {
        if (this.areCalendarsShown) {
            this.domHelper.setElementPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value || value === '') {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.init();
        }
        else {
            this.selected = [];
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_, changedByInput) {
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    onTouchedCallback() {
    }
    validate(formControl) {
        return this.validateFn(formControl.value);
    }
    processOnChangeCallback(selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    }
    ngOnInit() {
        this.isInitialized = true;
        this.init();
    }
    ngOnChanges(changes) {
        if (this.isInitialized) {
            this.init();
        }
    }
    ngAfterViewInit() {
        this.setElementPositionInDom();
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    }
    setElementPositionInDom() {
        this.calendarWrapper = this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        const { appendTo } = this.componentConfig;
        if (appendTo) {
            if (typeof appendTo === 'string') {
                this.appendToElement = document.querySelector(appendTo);
            }
            else {
                this.appendToElement = appendTo;
            }
        }
        else {
            this.appendToElement = this.elemRef.nativeElement;
        }
        this.appendToElement.appendChild(this.calendarWrapper);
    }
    setInputElementContainer() {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    }
    handleInnerElementClick(element) {
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', () => {
            this.hideStateHelper = true;
        }));
    }
    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
        this.initValidators();
    }
    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.isFocusedTrigger = true;
        this.onOpenDelayTimeoutHandler = setTimeout(() => {
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
            this.hideStateHelper = false;
            this.isFocusedTrigger = false;
            this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    }
    inputBlurred() {
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.onTouchedCallback();
    }
    showCalendars() {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    }
    hideCalendar() {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    }
    onViewDateChange(value) {
        const strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
            this.onSelect.emit({
                date: strVal,
                type: SelectEvent.INPUT,
                granularity: null
            });
        }
        else {
            this._selected = this.utilsService
                .getValidMomentArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    }
    dateSelected(date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity,
            type
        });
    }
    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    }
    onKeyPress(event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    }
    moveCalendarTo(date) {
        const momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
    startGlobalListeners() {
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', (e) => {
            this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', () => {
            this.onScroll();
        }), this.renderer.listen(document, 'click', () => {
            this.onBodyClick();
        }));
    }
    stopGlobalListeners() {
        this.globalListenersUnlisteners.forEach((ul) => ul());
        this.globalListenersUnlisteners = [];
    }
    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    }
};
DatePickerComponent.ctorParameters = () => [
    { type: DatePickerService },
    { type: DomHelper },
    { type: ElementRef },
    { type: Renderer2 },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], DatePickerComponent.prototype, "config", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "mode", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "disabled", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "displayDate", void 0);
__decorate([
    HostBinding('class'), Input()
], DatePickerComponent.prototype, "theme", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "minDate", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "maxDate", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "minTime", void 0);
__decorate([
    Input()
], DatePickerComponent.prototype, "maxTime", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "open", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "close", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "onChange", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "onGoToCurrent", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "onLeftNav", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "onRightNav", void 0);
__decorate([
    Output()
], DatePickerComponent.prototype, "onSelect", void 0);
__decorate([
    ViewChild('container')
], DatePickerComponent.prototype, "calendarContainer", void 0);
__decorate([
    ViewChild('dayCalendar')
], DatePickerComponent.prototype, "dayCalendarRef", void 0);
__decorate([
    ViewChild('monthCalendar')
], DatePickerComponent.prototype, "monthCalendarRef", void 0);
__decorate([
    ViewChild('daytimeCalendar')
], DatePickerComponent.prototype, "dayTimeCalendarRef", void 0);
__decorate([
    ViewChild('timeSelect')
], DatePickerComponent.prototype, "timeSelectRef", void 0);
__decorate([
    HostListener('click')
], DatePickerComponent.prototype, "onClick", null);
__decorate([
    HostListener('window:resize')
], DatePickerComponent.prototype, "onScroll", null);
DatePickerComponent = DatePickerComponent_1 = __decorate([
    Component({
        selector: 'dp-date-picker',
        template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\">\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <div #container>\n    <div [attr.data-hidden]=\"!_areCalendarsShown\"\n         [hidden]=\"!_areCalendarsShown\"\n         [ngSwitch]=\"mode\"\n         class=\"dp-popup {{theme}}\">\n      <dp-day-calendar #dayCalendar\n                       (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                       (onLeftNav)=\"onLeftNavClick($event)\"\n                       (onRightNav)=\"onRightNavClick($event)\"\n                       (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                       *ngSwitchCase=\"'day'\"\n                       [config]=\"dayCalendarConfig\"\n                       [displayDate]=\"displayDate\"\n                       [ngModel]=\"_selected\"\n                       [theme]=\"theme\">\n      </dp-day-calendar>\n\n      <dp-month-calendar #monthCalendar\n                         (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'month'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n      </dp-month-calendar>\n\n      <dp-time-select #timeSelect\n                      (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                      *ngSwitchCase=\"'time'\"\n                      [config]=\"timeSelectConfig\"\n                      [ngModel]=\"_selected && _selected[0]\"\n                      [theme]=\"theme\">\n      </dp-time-select>\n\n      <dp-day-time-calendar #daytimeCalendar\n                            (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                            (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                            (onLeftNav)=\"onLeftNavClick($event)\"\n                            (onRightNav)=\"onRightNavClick($event)\"\n                            *ngSwitchCase=\"'daytime'\"\n                            [config]=\"dayTimeCalendarConfig\"\n                            [displayDate]=\"displayDate\"\n                            [ngModel]=\"_selected && _selected[0]\"\n                            [theme]=\"theme\">\n      </dp-day-time-calendar>\n    </div>\n  </div>\n</div>\n",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            DatePickerService,
            DayTimeCalendarService,
            DayCalendarService,
            TimeSelectService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DatePickerComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DatePickerComponent_1),
                multi: true
            }
        ],
        styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:0}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;background:#fff;box-shadow:1px 1px 5px 0 rgba(0,0,0,.1);border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);z-index:9999;white-space:nowrap}"]
    })
], DatePickerComponent);
export { DatePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFakUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBSW5FLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRXhFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGdEQUFnRCxDQUFDO0FBR3RGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFDTCxhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBTXhCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQTBCakUsSUFBYSxtQkFBbUIsMkJBQWhDLE1BQWEsbUJBQW1CO0lBMkg5QixZQUE2QixnQkFBbUMsRUFDbkMsU0FBb0Is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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJRGF0ZX0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9kYXRlLm1vZGVsJztcbmltcG9ydCB7RG9tSGVscGVyfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvZG9tLWFwcGVuZGVyL2RvbS1hcHBlbmRlci5zZXJ2aWNlJztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQge0NhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUnO1xuaW1wb3J0IHtFQ2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZS1lbnVtJztcbmltcG9ydCB7Q2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7RUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtEYXlDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXlDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0lEYXlUaW1lQ2FsZW5kYXJDb25maWd9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtJVGltZVNlbGVjdENvbmZpZ30gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7VGltZVNlbGVjdENvbXBvbmVudH0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50JztcbmltcG9ydCB7VGltZVNlbGVjdFNlcnZpY2V9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF0ZVBpY2tlckNvbmZpZywgSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbH0gZnJvbSAnLi9kYXRlLXBpY2tlci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtJRHBEYXlQaWNrZXJBcGl9IGZyb20gJy4vZGF0ZS1waWNrZXIuYXBpJztcbmltcG9ydCB7RGF0ZVBpY2tlclNlcnZpY2V9IGZyb20gJy4vZGF0ZS1waWNrZXIuc2VydmljZSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtNb21lbnQsIHVuaXRPZlRpbWV9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge01vbnRoQ2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4uL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuaW1wb3J0IHtTZWxlY3RFdmVudH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NlbGVjdGlvbi1ldmVudC5lbnVtJztcbmltcG9ydCB7SVNlbGVjdGlvbkV2ZW50fSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2VsZWN0aW9uLWV2ZW50Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHAtZGF0ZS1waWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcGlja2VyLmNvbXBvbmVudC5sZXNzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICBEYXRlUGlja2VyU2VydmljZSxcbiAgICBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLFxuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICBUaW1lU2VsZWN0U2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVQaWNrZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uSW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbGlkYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT25EZXN0cm95IHtcblxuICBnZXQgb3Blbk9uRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Q29uZmlnLm9wZW5PbkZvY3VzO1xuICB9XG5cbiAgZ2V0IG9wZW5PbkNsaWNrKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuT25DbGljaztcbiAgfVxuXG4gIGdldCBhcmVDYWxlbmRhcnNTaG93bigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXJlQ2FsZW5kYXJzU2hvd247XG4gIH1cblxuICBzZXQgYXJlQ2FsZW5kYXJzU2hvd24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc3RhcnRHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZG9tSGVscGVyLmFwcGVuZEVsZW1lbnRUb1Bvc2l0aW9uKHtcbiAgICAgICAgY29udGFpbmVyOiB0aGlzLmFwcGVuZFRvRWxlbWVudCxcbiAgICAgICAgZWxlbWVudDogdGhpcy5jYWxlbmRhcldyYXBwZXIsXG4gICAgICAgIGFuY2hvcjogdGhpcy5pbnB1dEVsZW1lbnRDb250YWluZXIsXG4gICAgICAgIGRpbUVsZW06IHRoaXMucG9wdXBFbGVtLFxuICAgICAgICBkcm9wczogdGhpcy5jb21wb25lbnRDb25maWcuZHJvcHMsXG4gICAgICAgIG9wZW5zOiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuc1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcEdsb2JhbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLnBpY2tlckNsb3NlZCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FyZUNhbGVuZGFyc1Nob3duID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogTW9tZW50W10pIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMuaW5wdXRFbGVtZW50VmFsdWUgPSAoPHN0cmluZ1tdPnRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAuY29udmVydEZyb21Nb21lbnRBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsIHNlbGVjdGVkLCBFQ2FsZW5kYXJWYWx1ZS5TdHJpbmdBcnIpKVxuICAgICAgLmpvaW4oJyB8ICcpO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQpO1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh2YWwsIGZhbHNlKTtcbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQodmFsKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50RGF0ZVZpZXcoKTogTW9tZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudERhdGVWaWV3O1xuICB9XG5cbiAgc2V0IGN1cnJlbnREYXRlVmlldyhkYXRlOiBNb21lbnQpIHtcbiAgICB0aGlzLl9jdXJyZW50RGF0ZVZpZXcgPSBkYXRlO1xuXG4gICAgaWYgKHRoaXMuZGF5Q2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYubW92ZUNhbGVuZGFyVG8oZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9udGhDYWxlbmRhclJlZikge1xuICAgICAgdGhpcy5tb250aENhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRheVRpbWVDYWxlbmRhclJlZikge1xuICAgICAgdGhpcy5kYXlUaW1lQ2FsZW5kYXJSZWYubW92ZUNhbGVuZGFyVG8oZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBjb25maWc6IElEYXRlUGlja2VyQ29uZmlnO1xuICBASW5wdXQoKSBtb2RlOiBDYWxlbmRhck1vZGUgPSAnZGF5JztcbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBJbnB1dCgpIG1heERhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBJbnB1dCgpIG1pblRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBJbnB1dCgpIG1heFRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBPdXRwdXQoKSBvcGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgY2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJWYWx1ZT4oKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8SVNlbGVjdGlvbkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY2FsZW5kYXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2RheUNhbGVuZGFyJykgZGF5Q2FsZW5kYXJSZWY6IERheUNhbGVuZGFyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdtb250aENhbGVuZGFyJykgbW9udGhDYWxlbmRhclJlZjogTW9udGhDYWxlbmRhckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZGF5dGltZUNhbGVuZGFyJykgZGF5VGltZUNhbGVuZGFyUmVmOiBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3RpbWVTZWxlY3QnKSB0aW1lU2VsZWN0UmVmOiBUaW1lU2VsZWN0Q29tcG9uZW50O1xuICBjb21wb25lbnRDb25maWc6IElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWw7XG4gIGRheUNhbGVuZGFyQ29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWc7XG4gIGRheVRpbWVDYWxlbmRhckNvbmZpZzogSURheVRpbWVDYWxlbmRhckNvbmZpZztcbiAgdGltZVNlbGVjdENvbmZpZzogSVRpbWVTZWxlY3RDb25maWc7XG4gIGhpZGVTdGF0ZUhlbHBlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBpbnB1dFZhbHVlOiBDYWxlbmRhclZhbHVlO1xuICBpc0ZvY3VzZWRUcmlnZ2VyOiBib29sZWFuID0gZmFsc2U7XG4gIGlucHV0RWxlbWVudFZhbHVlOiBzdHJpbmc7XG4gIGNhbGVuZGFyV3JhcHBlcjogSFRNTEVsZW1lbnQ7XG4gIGFwcGVuZFRvRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIGlucHV0RWxlbWVudENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHBvcHVwRWxlbTogSFRNTEVsZW1lbnQ7XG4gIGhhbmRsZUlubmVyRWxlbWVudENsaWNrVW5saXN0ZW5lcnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgYXBpOiBJRHBEYXlQaWNrZXJBcGkgPSB7XG4gICAgb3BlbjogdGhpcy5zaG93Q2FsZW5kYXJzLmJpbmQodGhpcyksXG4gICAgY2xvc2U6IHRoaXMuaGlkZUNhbGVuZGFyLmJpbmQodGhpcyksXG4gICAgbW92ZUNhbGVuZGFyVG86IHRoaXMubW92ZUNhbGVuZGFyVG8uYmluZCh0aGlzKVxuICB9O1xuICBzZWxlY3RFdmVudCA9IFNlbGVjdEV2ZW50O1xuXG4gIF9hcmVDYWxlbmRhcnNTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xuICBfc2VsZWN0ZWQ6IE1vbWVudFtdID0gW107XG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBwcml2YXRlIG9uT3BlbkRlbGF5VGltZW91dEhhbmRsZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBkYXlQaWNrZXJTZXJ2aWNlOiBEYXRlUGlja2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBkb21IZWxwZXI6IERvbUhlbHBlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25DbGljaygpIHtcbiAgICBpZiAoIXRoaXMub3Blbk9uQ2xpY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNGb2N1c2VkVHJpZ2dlciAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5oaWRlU3RhdGVIZWxwZXIgPSB0cnVlO1xuICAgICAgaWYgKCF0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhbGVuZGFycygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQm9keUNsaWNrKCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudENvbmZpZy5oaWRlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGlmICghdGhpcy5oaWRlU3RhdGVIZWxwZXIgJiYgdGhpcy5hcmVDYWxlbmRhcnNTaG93bikge1xuICAgICAgICB0aGlzLmhpZGVDYWxlbmRhcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBvblNjcm9sbCgpIHtcbiAgICBpZiAodGhpcy5hcmVDYWxlbmRhcnNTaG93bikge1xuICAgICAgdGhpcy5kb21IZWxwZXIuc2V0RWxlbWVudFBvc2l0aW9uKHtcbiAgICAgICAgY29udGFpbmVyOiB0aGlzLmFwcGVuZFRvRWxlbWVudCxcbiAgICAgICAgZWxlbWVudDogdGhpcy5jYWxlbmRhcldyYXBwZXIsXG4gICAgICAgIGFuY2hvcjogdGhpcy5pbnB1dEVsZW1lbnRDb250YWluZXIsXG4gICAgICAgIGRpbUVsZW06IHRoaXMucG9wdXBFbGVtLFxuICAgICAgICBkcm9wczogdGhpcy5jb21wb25lbnRDb25maWcuZHJvcHMsXG4gICAgICAgIG9wZW5zOiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuc1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5jb252ZXJ0VG9Nb21lbnRBcnJheSh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gIH1cblxuICBvbkNoYW5nZUNhbGxiYWNrKF86IGFueSwgY2hhbmdlZEJ5SW5wdXQ6IGJvb2xlYW4pIHtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gIH1cblxuICBvblRvdWNoZWRDYWxsYmFjaygpIHtcbiAgfVxuXG4gIHZhbGlkYXRlKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICB9XG5cbiAgcHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQ6IE1vbWVudFtdIHwgc3RyaW5nKTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgaWYgKHR5cGVvZiBzZWxlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBzZWxlY3RlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgICAgc2VsZWN0ZWQsXG4gICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnJldHVybmVkVmFsdWVUeXBlIHx8IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGluaXRWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZVZhbGlkYXRvcihcbiAgICAgIHtcbiAgICAgICAgbWluRGF0ZTogdGhpcy5taW5EYXRlLFxuICAgICAgICBtYXhEYXRlOiB0aGlzLm1heERhdGUsXG4gICAgICAgIG1pblRpbWU6IHRoaXMubWluVGltZSxcbiAgICAgICAgbWF4VGltZTogdGhpcy5tYXhUaW1lXG4gICAgICB9LCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsIHRoaXMubW9kZSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkKSwgZmFsc2UpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JbkRvbSgpO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRQb3NpdGlvbkluRG9tKCk6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXJXcmFwcGVyID0gPEhUTUxFbGVtZW50PnRoaXMuY2FsZW5kYXJDb250YWluZXIubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnNldElucHV0RWxlbWVudENvbnRhaW5lcigpO1xuICAgIHRoaXMucG9wdXBFbGVtID0gdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRwLXBvcHVwJyk7XG4gICAgdGhpcy5oYW5kbGVJbm5lckVsZW1lbnRDbGljayh0aGlzLnBvcHVwRWxlbSk7XG5cbiAgICBjb25zdCB7YXBwZW5kVG99ID0gdGhpcy5jb21wb25lbnRDb25maWc7XG4gICAgaWYgKGFwcGVuZFRvKSB7XG4gICAgICBpZiAodHlwZW9mIGFwcGVuZFRvID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKDxzdHJpbmc+YXBwZW5kVG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YXBwZW5kVG87XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50ID0gdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jYWxlbmRhcldyYXBwZXIpO1xuICB9XG5cbiAgc2V0SW5wdXRFbGVtZW50Q29udGFpbmVyKCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyID0gdGhpcy51dGlsc1NlcnZpY2UuZ2V0TmF0aXZlRWxlbWVudCh0aGlzLmNvbXBvbmVudENvbmZpZy5pbnB1dEVsZW1lbnRDb250YWluZXIpXG4gICAgICB8fCB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHAtaW5wdXQtY29udGFpbmVyJylcbiAgICAgIHx8IGRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBoYW5kbGVJbm5lckVsZW1lbnRDbGljayhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2tVbmxpc3RlbmVycy5wdXNoKFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWxlbWVudCwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZywgdGhpcy5tb2RlKTtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMuZGlzcGxheURhdGVcbiAgICAgID8gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KHRoaXMuZGlzcGxheURhdGUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCkuY2xvbmUoKVxuICAgICAgOiB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0RGVmYXVsdERpc3BsYXlEYXRlKFxuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW5cbiAgICAgICAgKTtcbiAgICB0aGlzLmRheUNhbGVuZGFyQ29uZmlnID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmdldERheUNvbmZpZ1NlcnZpY2UodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMuZGF5VGltZUNhbGVuZGFyQ29uZmlnID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmdldERheVRpbWVDb25maWdTZXJ2aWNlKHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICB0aGlzLnRpbWVTZWxlY3RDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0VGltZUNvbmZpZ1NlcnZpY2UodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgfVxuXG4gIGlucHV0Rm9jdXNlZCgpIHtcbiAgICBpZiAoIXRoaXMub3Blbk9uRm9jdXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5vbk9wZW5EZWxheVRpbWVvdXRIYW5kbGVyKTtcbiAgICB0aGlzLmlzRm9jdXNlZFRyaWdnZXIgPSB0cnVlO1xuICAgIHRoaXMub25PcGVuRGVsYXlUaW1lb3V0SGFuZGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhbGVuZGFycygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IGZhbHNlO1xuXG4gICAgICB0aGlzLmlzRm9jdXNlZFRyaWdnZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfSwgdGhpcy5jb21wb25lbnRDb25maWcub25PcGVuRGVsYXkpO1xuICB9XG5cbiAgaW5wdXRCbHVycmVkKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLm9uT3BlbkRlbGF5VGltZW91dEhhbmRsZXIpO1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgfVxuXG4gIHNob3dDYWxlbmRhcnMoKSB7XG4gICAgdGhpcy5oaWRlU3RhdGVIZWxwZXIgPSB0cnVlO1xuICAgIHRoaXMuYXJlQ2FsZW5kYXJzU2hvd24gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudGltZVNlbGVjdFJlZikge1xuICAgICAgdGhpcy50aW1lU2VsZWN0UmVmLmFwaS50cmlnZ2VyQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuLmVtaXQoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgaGlkZUNhbGVuZGFyKCkge1xuICAgIHRoaXMuYXJlQ2FsZW5kYXJzU2hvd24gPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRheUNhbGVuZGFyUmVmKSB7XG4gICAgICB0aGlzLmRheUNhbGVuZGFyUmVmLmFwaS50b2dnbGVDYWxlbmRhck1vZGUoRUNhbGVuZGFyTW9kZS5EYXkpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UuZW1pdCgpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBvblZpZXdEYXRlQ2hhbmdlKHZhbHVlOiBDYWxlbmRhclZhbHVlKSB7XG4gICAgY29uc3Qgc3RyVmFsID0gdmFsdWUgPyB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9TdHJpbmcodmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCkgOiAnJztcbiAgICBpZiAodGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmlzVmFsaWRJbnB1dERhdGVWYWx1ZShzdHJWYWwsIHRoaXMuY29tcG9uZW50Q29uZmlnKSkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5jb252ZXJ0SW5wdXRWYWx1ZVRvTW9tZW50QXJyYXkoc3RyVmFsLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMuc2VsZWN0ZWQubGVuZ3RoXG4gICAgICAgID8gdGhpcy51dGlsc1NlcnZpY2UuZ2V0RGVmYXVsdERpc3BsYXlEYXRlKFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApXG4gICAgICAgIDogdGhpcy5jdXJyZW50RGF0ZVZpZXc7XG5cbiAgICAgIHRoaXMub25TZWxlY3QuZW1pdCh7XG4gICAgICAgIGRhdGU6IHN0clZhbCxcbiAgICAgICAgdHlwZTogU2VsZWN0RXZlbnQuSU5QVVQsXG4gICAgICAgIGdyYW51bGFyaXR5OiBudWxsXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXRWYWxpZE1vbWVudEFycmF5KHN0clZhbCwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHN0clZhbCksIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGRhdGVTZWxlY3RlZChkYXRlOiBJRGF0ZSwgZ3JhbnVsYXJpdHk6IHVuaXRPZlRpbWUuQmFzZSwgdHlwZTogU2VsZWN0RXZlbnQsIGlnbm9yZUNsb3NlPzogYm9vbGVhbikge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgLnVwZGF0ZVNlbGVjdGVkKHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsIHRoaXMuc2VsZWN0ZWQsIGRhdGUsIGdyYW51bGFyaXR5KTtcbiAgICBpZiAoIWlnbm9yZUNsb3NlKSB7XG4gICAgICB0aGlzLm9uRGF0ZUNsaWNrKCk7XG4gICAgfVxuXG4gICAgdGhpcy5vblNlbGVjdC5lbWl0KHtcbiAgICAgIGRhdGU6IGRhdGUuZGF0ZSxcbiAgICAgIGdyYW51bGFyaXR5LFxuICAgICAgdHlwZVxuICAgIH0pO1xuICB9XG5cbiAgb25EYXRlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50Q29uZmlnLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgIHNldFRpbWVvdXQodGhpcy5oaWRlQ2FsZW5kYXIuYmluZCh0aGlzKSwgdGhpcy5jb21wb25lbnRDb25maWcuY2xvc2VPblNlbGVjdERlbGF5KTtcbiAgICB9XG4gIH1cblxuICBvbktleVByZXNzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlICg5KTpcbiAgICAgIGNhc2UgKDI3KTpcbiAgICAgICAgdGhpcy5oaWRlQ2FsZW5kYXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgbW92ZUNhbGVuZGFyVG8oZGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGNvbnN0IG1vbWVudERhdGUgPSB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQoZGF0ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IG1vbWVudERhdGU7XG4gIH1cblxuICBvbkxlZnROYXZDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uUmlnaHROYXZDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25SaWdodE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBzdGFydEdsb2JhbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudCwgJ2tleWRvd24nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLm9uS2V5UHJlc3MoZSk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAnc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uU2Nyb2xsKCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub25Cb2R5Q2xpY2soKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHN0b3BHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5nbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVycy5mb3JFYWNoKCh1bCkgPT4gdWwoKSk7XG4gICAgdGhpcy5nbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5oYW5kbGVJbm5lckVsZW1lbnRDbGlja1VubGlzdGVuZXJzLmZvckVhY2godWwgPT4gdWwoKSk7XG5cbiAgICBpZiAodGhpcy5hcHBlbmRUb0VsZW1lbnQpIHtcbiAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuY2FsZW5kYXJXcmFwcGVyKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==