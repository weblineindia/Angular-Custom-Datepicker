import { __assign, __decorate } from "tslib";
import { EventEmitter, Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
var moment = momentNs;
var DatePickerService = /** @class */ (function () {
    function DatePickerService(utilsService, timeSelectService, daytimeCalendarService) {
        this.utilsService = utilsService;
        this.timeSelectService = timeSelectService;
        this.daytimeCalendarService = daytimeCalendarService;
        this.onPickerClosed = new EventEmitter();
        this.defaultConfig = {
            closeOnSelect: true,
            closeOnSelectDelay: 100,
            closeOnEnter: true,
            format: 'DD-MM-YYYY',
            openOnFocus: true,
            openOnClick: true,
            onOpenDelay: 0,
            disableKeypress: false,
            showNearMonthDays: true,
            showWeekNumbers: false,
            enableMonthSelector: true,
            showGoToCurrent: true,
            locale: moment.locale(),
            hideOnOutsideClick: true
        };
    }
    // todo:: add unit tests
    DatePickerService.prototype.getConfig = function (config, mode) {
        if (mode === void 0) { mode = 'daytime'; }
        var _config = __assign(__assign(__assign({}, this.defaultConfig), { format: this.getDefaultFormatByMode(mode) }), this.utilsService.clearUndefined(config));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
            _config.closeOnSelect = false;
        }
        moment.locale(_config.locale);
        return _config;
    };
    DatePickerService.prototype.getDayConfigService = function (pickerConfig) {
        return {
            min: pickerConfig.min,
            max: pickerConfig.max,
            isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
            weekDayFormat: pickerConfig.weekDayFormat,
            weekDayFormatter: pickerConfig.weekDayFormatter,
            showNearMonthDays: pickerConfig.showNearMonthDays,
            showWeekNumbers: pickerConfig.showWeekNumbers,
            firstDayOfWeek: pickerConfig.firstDayOfWeek,
            format: pickerConfig.format,
            allowMultiSelect: pickerConfig.allowMultiSelect,
            monthFormat: pickerConfig.monthFormat,
            monthFormatter: pickerConfig.monthFormatter,
            enableMonthSelector: pickerConfig.enableMonthSelector,
            yearFormat: pickerConfig.yearFormat,
            yearFormatter: pickerConfig.yearFormatter,
            dayBtnFormat: pickerConfig.dayBtnFormat,
            dayBtnFormatter: pickerConfig.dayBtnFormatter,
            dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
            monthBtnFormat: pickerConfig.monthBtnFormat,
            monthBtnFormatter: pickerConfig.monthBtnFormatter,
            monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
            locale: pickerConfig.locale,
            returnedValueType: pickerConfig.returnedValueType,
            showGoToCurrent: pickerConfig.showGoToCurrent,
            unSelectOnClick: pickerConfig.unSelectOnClick,
            numOfMonthRows: pickerConfig.numOfMonthRows
        };
    };
    DatePickerService.prototype.getDayTimeConfigService = function (pickerConfig) {
        return this.daytimeCalendarService.getConfig(pickerConfig);
    };
    DatePickerService.prototype.getTimeConfigService = function (pickerConfig) {
        return this.timeSelectService.getConfig(pickerConfig);
    };
    DatePickerService.prototype.pickerClosed = function () {
        this.onPickerClosed.emit();
    };
    // todo:: add unit tests
    DatePickerService.prototype.isValidInputDateValue = function (value, config) {
        var _this = this;
        value = value ? value : '';
        var datesStrArr = this.utilsService.datesStringToStringArray(value);
        return datesStrArr.every(function (date) { return _this.utilsService.isDateValid(date, config.format); });
    };
    // todo:: add unit tests
    DatePickerService.prototype.convertInputValueToMomentArray = function (value, config) {
        value = value ? value : '';
        var datesStrArr = this.utilsService.datesStringToStringArray(value);
        return this.utilsService.convertToMomentArray(datesStrArr, config);
    };
    DatePickerService.prototype.getDefaultFormatByMode = function (mode) {
        switch (mode) {
            case 'day':
                return 'DD-MM-YYYY';
            case 'daytime':
                return 'DD-MM-YYYY HH:mm:ss';
            case 'time':
                return 'HH:mm:ss';
            case 'month':
                return 'MMM, YYYY';
        }
    };
    DatePickerService.ctorParameters = function () { return [
        { type: UtilsService },
        { type: TimeSelectService },
        { type: DayTimeCalendarService }
    ]; };
    DatePickerService = __decorate([
        Injectable()
    ], DatePickerService);
    return DatePickerService;
}());
export { DatePickerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sS0FBSyxRQUFRLE1BQU0sUUFBUSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUl0RixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFHeEI7SUFtQkUsMkJBQW9CLFlBQTBCLEVBQzFCLGlCQUFvQyxFQUNwQyxzQkFBOEM7UUFGOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBcEJ6RCxtQkFBYyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELGtCQUFhLEdBQThCO1lBQ2pELGFBQWEsRUFBRSxJQUFJO1lBQ25CLGtCQUFrQixFQUFFLEdBQUc7WUFDdkIsWUFBWSxFQUFFLElBQUk7WUFDbEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLENBQUM7WUFDZCxlQUFlLEVBQUUsS0FBSztZQUN0QixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLG1CQUFtQixFQUFFLElBQUk7WUFDekIsZUFBZSxFQUFFLElBQUk7WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFD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aUJBQWlCLENBb0g3QjtJQUFELHdCQUFDO0NBQUEsQUFwSEQsSUFvSEM7U0FwSFksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudEVtaXR0ZXIsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtJRGF0ZVBpY2tlckNvbmZpZywgSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbH0gZnJvbSAnLi9kYXRlLXBpY2tlci1jb25maWcubW9kZWwnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SURheUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge1RpbWVTZWxlY3RTZXJ2aWNlfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5zZXJ2aWNlJztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0lUaW1lU2VsZWN0Q29uZmlnfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtDYWxlbmRhck1vZGV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyU2VydmljZSB7XG4gIHJlYWRvbmx5IG9uUGlja2VyQ2xvc2VkOiBFdmVudEVtaXR0ZXI8bnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgZGVmYXVsdENvbmZpZzogSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbCA9IHtcbiAgICBjbG9zZU9uU2VsZWN0OiB0cnVlLFxuICAgIGNsb3NlT25TZWxlY3REZWxheTogMTAwLFxuICAgIGNsb3NlT25FbnRlcjogdHJ1ZSxcbiAgICBmb3JtYXQ6ICdERC1NTS1ZWVlZJyxcbiAgICBvcGVuT25Gb2N1czogdHJ1ZSxcbiAgICBvcGVuT25DbGljazogdHJ1ZSxcbiAgICBvbk9wZW5EZWxheTogMCxcbiAgICBkaXNhYmxlS2V5cHJlc3M6IGZhbHNlLFxuICAgIHNob3dOZWFyTW9udGhEYXlzOiB0cnVlLFxuICAgIHNob3dXZWVrTnVtYmVyczogZmFsc2UsXG4gICAgZW5hYmxlTW9udGhTZWxlY3RvcjogdHJ1ZSxcbiAgICBzaG93R29Ub0N1cnJlbnQ6IHRydWUsXG4gICAgbG9jYWxlOiBtb21lbnQubG9jYWxlKCksXG4gICAgaGlkZU9uT3V0c2lkZUNsaWNrOiB0cnVlXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aW1lU2VsZWN0U2VydmljZTogVGltZVNlbGVjdFNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgZGF5dGltZUNhbGVuZGFyU2VydmljZTogRGF5VGltZUNhbGVuZGFyU2VydmljZSkge1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIGdldENvbmZpZyhjb25maWc6IElEYXRlUGlja2VyQ29uZmlnLCBtb2RlOiBDYWxlbmRhck1vZGUgPSAnZGF5dGltZScpOiBJRGF0ZVBpY2tlckNvbmZpZ0ludGVybmFsIHtcbiAgICBjb25zdCBfY29uZmlnID0gPElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWw+e1xuICAgICAgLi4udGhpcy5kZWZhdWx0Q29uZmlnLFxuICAgICAgZm9ybWF0OiB0aGlzLmdldERlZmF1bHRGb3JtYXRCeU1vZGUobW9kZSksXG4gICAgICAuLi50aGlzLnV0aWxzU2VydmljZS5jbGVhclVuZGVmaW5lZChjb25maWcpXG4gICAgfTtcblxuICAgIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRQcm9wc1RvTW9tZW50KF9jb25maWcsIF9jb25maWcuZm9ybWF0LCBbJ21pbicsICdtYXgnXSk7XG5cbiAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5hbGxvd011bHRpU2VsZWN0ICYmIGNvbmZpZy5jbG9zZU9uU2VsZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIF9jb25maWcuY2xvc2VPblNlbGVjdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG1vbWVudC5sb2NhbGUoX2NvbmZpZy5sb2NhbGUpO1xuXG4gICAgcmV0dXJuIF9jb25maWc7XG4gIH1cblxuICBnZXREYXlDb25maWdTZXJ2aWNlKHBpY2tlckNvbmZpZzogSURhdGVQaWNrZXJDb25maWcpOiBJRGF5Q2FsZW5kYXJDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBtaW46IHBpY2tlckNvbmZpZy5taW4sXG4gICAgICBtYXg6IHBpY2tlckNvbmZpZy5tYXgsXG4gICAgICBpc0RheURpc2FibGVkQ2FsbGJhY2s6IHBpY2tlckNvbmZpZy5pc0RheURpc2FibGVkQ2FsbGJhY2ssXG4gICAgICB3ZWVrRGF5Rm9ybWF0OiBwaWNrZXJDb25maWcud2Vla0RheUZvcm1hdCxcbiAgICAgIHdlZWtEYXlGb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy53ZWVrRGF5Rm9ybWF0dGVyLFxuICAgICAgc2hvd05lYXJNb250aERheXM6IHBpY2tlckNvbmZpZy5zaG93TmVhck1vbnRoRGF5cyxcbiAgICAgIHNob3dXZWVrTnVtYmVyczogcGlja2VyQ29uZmlnLnNob3dXZWVrTnVtYmVycyxcbiAgICAgIGZpcnN0RGF5T2ZXZWVrOiBwaWNrZXJDb25maWcuZmlyc3REYXlPZldlZWssXG4gICAgICBmb3JtYXQ6IHBpY2tlckNvbmZpZy5mb3JtYXQsXG4gICAgICBhbGxvd011bHRpU2VsZWN0OiBwaWNrZXJDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgIG1vbnRoRm9ybWF0OiBwaWNrZXJDb25maWcubW9udGhGb3JtYXQsXG4gICAgICBtb250aEZvcm1hdHRlcjogcGlja2VyQ29uZmlnLm1vbnRoRm9ybWF0dGVyLFxuICAgICAgZW5hYmxlTW9udGhTZWxlY3RvcjogcGlja2VyQ29uZmlnLmVuYWJsZU1vbnRoU2VsZWN0b3IsXG4gICAgICB5ZWFyRm9ybWF0OiBwaWNrZXJDb25maWcueWVhckZvcm1hdCxcbiAgICAgIHllYXJGb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy55ZWFyRm9ybWF0dGVyLFxuICAgICAgZGF5QnRuRm9ybWF0OiBwaWNrZXJDb25maWcuZGF5QnRuRm9ybWF0LFxuICAgICAgZGF5QnRuRm9ybWF0dGVyOiBwaWNrZXJDb25maWcuZGF5QnRuRm9ybWF0dGVyLFxuICAgICAgZGF5QnRuQ3NzQ2xhc3NDYWxsYmFjazogcGlja2VyQ29uZmlnLmRheUJ0bkNzc0NsYXNzQ2FsbGJhY2ssXG4gICAgICBtb250aEJ0bkZvcm1hdDogcGlja2VyQ29uZmlnLm1vbnRoQnRuRm9ybWF0LFxuICAgICAgbW9udGhCdG5Gb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy5tb250aEJ0bkZvcm1hdHRlcixcbiAgICAgIG1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjazogcGlja2VyQ29uZmlnLm1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjayxcbiAgICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiBwaWNrZXJDb25maWcubXVsdGlwbGVZZWFyc05hdmlnYXRlQnksXG4gICAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IHBpY2tlckNvbmZpZy5zaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb24sXG4gICAgICBsb2NhbGU6IHBpY2tlckNvbmZpZy5sb2NhbGUsXG4gICAgICByZXR1cm5lZFZhbHVlVHlwZTogcGlja2VyQ29uZmlnLnJldHVybmVkVmFsdWVUeXBlLFxuICAgICAgc2hvd0dvVG9DdXJyZW50OiBwaWNrZXJDb25maWcuc2hvd0dvVG9DdXJyZW50LFxuICAgICAgdW5TZWxlY3RPbkNsaWNrOiBwaWNrZXJDb25maWcudW5TZWxlY3RPbkNsaWNrLFxuICAgICAgbnVtT2ZNb250aFJvd3M6IHBpY2tlckNvbmZpZy5udW1PZk1vbnRoUm93c1xuICAgIH07XG4gIH1cblxuICBnZXREYXlUaW1lQ29uZmlnU2VydmljZShwaWNrZXJDb25maWc6IElEYXRlUGlja2VyQ29uZmlnKTogSVRpbWVTZWxlY3RDb25maWcge1xuICAgIHJldHVybiB0aGlzLmRheXRpbWVDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKHBpY2tlckNvbmZpZyk7XG4gIH1cblxuICBnZXRUaW1lQ29uZmlnU2VydmljZShwaWNrZXJDb25maWc6IElEYXRlUGlja2VyQ29uZmlnKTogSVRpbWVTZWxlY3RDb25maWcge1xuICAgIHJldHVybiB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldENvbmZpZyhwaWNrZXJDb25maWcpO1xuICB9XG5cbiAgcGlja2VyQ2xvc2VkKCkge1xuICAgIHRoaXMub25QaWNrZXJDbG9zZWQuZW1pdCgpO1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIGlzVmFsaWRJbnB1dERhdGVWYWx1ZSh2YWx1ZTogc3RyaW5nLCBjb25maWc6IElEYXRlUGlja2VyQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgdmFsdWUgPSB2YWx1ZSA/IHZhbHVlIDogJyc7XG4gICAgY29uc3QgZGF0ZXNTdHJBcnI6IHN0cmluZ1tdID0gdGhpcy51dGlsc1NlcnZpY2UuZGF0ZXNTdHJpbmdUb1N0cmluZ0FycmF5KHZhbHVlKTtcblxuICAgIHJldHVybiBkYXRlc1N0ckFyci5ldmVyeShkYXRlID0+IHRoaXMudXRpbHNTZXJ2aWNlLmlzRGF0ZVZhbGlkKGRhdGUsIGNvbmZpZy5mb3JtYXQpKTtcbiAgfVxuXG4gIC8vIHRvZG86OiBhZGQgdW5pdCB0ZXN0c1xuICBjb252ZXJ0SW5wdXRWYWx1ZVRvTW9tZW50QXJyYXkodmFsdWU6IHN0cmluZywgY29uZmlnOiBJRGF0ZVBpY2tlckNvbmZpZyk6IE1vbWVudFtdIHtcbiAgICB2YWx1ZSA9IHZhbHVlID8gdmFsdWUgOiAnJztcbiAgICBjb25zdCBkYXRlc1N0ckFycjogc3RyaW5nW10gPSB0aGlzLnV0aWxzU2VydmljZS5kYXRlc1N0cmluZ1RvU3RyaW5nQXJyYXkodmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudEFycmF5KGRhdGVzU3RyQXJyLCBjb25maWcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZWZhdWx0Rm9ybWF0QnlNb2RlKG1vZGU6IENhbGVuZGFyTW9kZSk6IHN0cmluZyB7XG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlICdkYXknOlxuICAgICAgICByZXR1cm4gJ0RELU1NLVlZWVknO1xuICAgICAgY2FzZSAnZGF5dGltZSc6XG4gICAgICAgIHJldHVybiAnREQtTU0tWVlZWSBISDptbTpzcyc7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgcmV0dXJuICdISDptbTpzcyc7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiAnTU1NLCBZWVlZJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==