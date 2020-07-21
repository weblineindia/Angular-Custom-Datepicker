import { CalendarMode } from '../common/types/calendar-mode';
import { IDatePickerDirectiveConfig } from './date-picker-directive-config.model';
import { DatePickerDirectiveService } from './date-picker-directive.service';
import { IDpDayPickerApi } from './date-picker.api';
import { DatePickerComponent } from './date-picker.component';
import { ComponentFactoryResolver, ElementRef, EventEmitter, OnInit, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CalendarValue, ISelectionEvent, SingleCalendarValue } from '..';
import { INavEvent } from '../common/models/navigation-event.model';
import { UtilsService } from '../common/services/utils/utils.service';
import * as ɵngcc0 from '@angular/core';
export declare class DatePickerDirective implements OnInit {
    viewContainerRef: ViewContainerRef;
    elemRef: ElementRef;
    componentFactoryResolver: ComponentFactoryResolver;
    service: DatePickerDirectiveService;
    formControl: NgControl;
    utilsService: UtilsService;
    get config(): IDatePickerDirectiveConfig;
    set config(config: IDatePickerDirectiveConfig);
    get attachTo(): ElementRef | string;
    set attachTo(attachTo: ElementRef | string);
    get theme(): string;
    set theme(theme: string);
    get mode(): CalendarMode;
    set mode(mode: CalendarMode);
    get minDate(): SingleCalendarValue;
    set minDate(minDate: SingleCalendarValue);
    get maxDate(): SingleCalendarValue;
    set maxDate(maxDate: SingleCalendarValue);
    get minTime(): SingleCalendarValue;
    set minTime(minTime: SingleCalendarValue);
    get maxTime(): SingleCalendarValue;
    set maxTime(maxTime: SingleCalendarValue);
    get displayDate(): SingleCalendarValue;
    set displayDate(displayDate: SingleCalendarValue);
    open: EventEmitter<void>;
    close: EventEmitter<void>;
    onChange: EventEmitter<CalendarValue>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    onSelect: EventEmitter<ISelectionEvent>;
    datePicker: DatePickerComponent;
    api: IDpDayPickerApi;
    private _config;
    private _attachTo;
    private _theme;
    private _mode;
    private _minDate;
    private _maxDate;
    private _minTime;
    private _maxTime;
    private _displayDate;
    constructor(viewContainerRef: ViewContainerRef, elemRef: ElementRef, componentFactoryResolver: ComponentFactoryResolver, service: DatePickerDirectiveService, formControl: NgControl, utilsService: UtilsService);
    ngOnInit(): void;
    createDatePicker(): DatePickerComponent;
    attachModelToDatePicker(): void;
    onClick(): void;
    onFocus(): void;
    onEnter(): void;
    markForCheck(): void;
    private updateDatepickerConfig;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DatePickerDirective, [null, null, null, null, { optional: true; }, null]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<DatePickerDirective, "[dpDayPicker]", ["dpDayPicker"], { "config": "dpDayPicker"; "attachTo": "attachTo"; "theme": "theme"; "mode": "mode"; "minDate": "minDate"; "maxDate": "maxDate"; "minTime": "minTime"; "maxTime": "maxTime"; "displayDate": "displayDate"; }, { "open": "open"; "close": "close"; "onChange": "onChange"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; "onSelect": "onSelect"; }, never>;
}

//# sourceMappingURL=date-picker.directive.d.ts.map