import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
let DayCalendarService = class DayCalendarService {
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            showNearMonthDays: true,
            showWeekNumbers: false,
            firstDayOfWeek: 'su',
            weekDayFormat: 'ddd',
            format: 'DD-MM-YYYY',
            allowMultiSelect: false,
            monthFormat: 'MMM, YYYY',
            enableMonthSelector: true,
            locale: moment.locale(),
            dayBtnFormat: 'DD',
            unSelectOnClick: true
        };
        this.DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    }
    getConfig(config) {
        const _config = Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.utilsService.clearUndefined(config));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment.locale(_config.locale);
        return _config;
    }
    generateDaysMap(firstDayOfWeek) {
        const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[day] = index;
            return map;
        }, {});
    }
    generateMonthArray(config, month, selected) {
        let monthArray = [];
        const firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
        const firstDayOfBoard = month.clone().startOf('month');
        while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
            firstDayOfBoard.subtract(1, 'day');
        }
        const current = firstDayOfBoard.clone();
        const prevMonth = month.clone().subtract(1, 'month');
        const nextMonth = month.clone().add(1, 'month');
        const today = moment();
        const daysOfCalendar = this.utilsService.createArray(42)
            .reduce((array) => {
            array.push({
                date: current.clone(),
                selected: !!selected.find(selectedDay => current.isSame(selectedDay, 'day')),
                currentMonth: current.isSame(month, 'month'),
                prevMonth: current.isSame(prevMonth, 'month'),
                nextMonth: current.isSame(nextMonth, 'month'),
                currentDay: current.isSame(today, 'day'),
                disabled: this.isDateDisabled(current, config)
            });
            current.add(1, 'day');
            return array;
        }, []);
        daysOfCalendar.forEach((day, index) => {
            const weekIndex = Math.floor(index / 7);
            if (!monthArray[weekIndex]) {
                monthArray.push([]);
            }
            monthArray[weekIndex].push(day);
        });
        if (!config.showNearMonthDays) {
            monthArray = this.removeNearMonthWeeks(month, monthArray);
        }
        return monthArray;
    }
    generateWeekdays(firstDayOfWeek) {
        const weekdayNames = {
            su: moment().day(0),
            mo: moment().day(1),
            tu: moment().day(2),
            we: moment().day(3),
            th: moment().day(4),
            fr: moment().day(5),
            sa: moment().day(6)
        };
        const weekdays = [];
        const daysMap = this.generateDaysMap(firstDayOfWeek);
        for (const dayKey in daysMap) {
            if (daysMap.hasOwnProperty(dayKey)) {
                weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
            }
        }
        return weekdays;
    }
    isDateDisabled(date, config) {
        if (config.isDayDisabledCallback) {
            return config.isDayDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'day')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'day'));
    }
    // todo:: add unit tests
    getHeaderLabel(config, month) {
        if (config.monthFormatter) {
            return config.monthFormatter(month);
        }
        return month.format(config.monthFormat);
    }
    // todo:: add unit tests
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'month') : true;
    }
    // todo:: add unit tests
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'month') : true;
    }
    generateDaysIndexMap(firstDayOfWeek) {
        const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[index] = day;
            return map;
        }, {});
    }
    getMonthCalendarConfig(componentConfig) {
        return this.utilsService.clearUndefined({
            min: componentConfig.min,
            max: componentConfig.max,
            format: componentConfig.format,
            isNavHeaderBtnClickable: true,
            allowMultiSelect: false,
            locale: componentConfig.locale,
            yearFormat: componentConfig.yearFormat,
            yearFormatter: componentConfig.yearFormatter,
            monthBtnFormat: componentConfig.monthBtnFormat,
            monthBtnFormatter: componentConfig.monthBtnFormatter,
            monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
            showGoToCurrent: componentConfig.showGoToCurrent,
            numOfMonthRows: componentConfig.numOfMonthRows
        });
    }
    getDayBtnText(config, day) {
        if (config.dayBtnFormatter) {
            return config.dayBtnFormatter(day);
        }
        return day.format(config.dayBtnFormat);
    }
    getDayBtnCssClass(config, day) {
        if (config.dayBtnCssClassCallback) {
            return config.dayBtnCssClassCallback(day);
        }
        return '';
    }
    removeNearMonthWeeks(currentMonth, monthArray) {
        if (monthArray[monthArray.length - 1].find((day) => day.date.isSame(currentMonth, 'month'))) {
            return monthArray;
        }
        else {
            return monthArray.slice(0, -1);
        }
    }
};
DayCalendarService.ctorParameters = () => [
    { type: UtilsService }
];
DayCalendarService = __decorate([
    Injectable()
], DayCalendarService);
export { DayCalendarService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzItZGF0ZS1waWNrZXIvIiwic291cmNlcyI6WyJkYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFHbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBS3BFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUd4QixJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQWdCN0IsWUFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFmckMsbUJBQWMsR0FBdUI7WUFDNUMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixlQUFlLEVBQUUsS0FBSztZQUN0QixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsS0FBSztZQUNwQixNQUFNLEVBQUUsWUFBWTtZQUNwQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLG1CQUFtQixFQUFFLElBQUk7WUFDekIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsWUFBWSxFQUFFLElBQUk7WUFDbEIsZUFBZSxFQUFFLElBQUk7U0FDdEIsQ0FBQztRQUNlLFNBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBR25FLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBMEI7UUFDbEMsTUFBTSxPQUFPLEdBQUcsZ0NBQ1gsSUFBSSxDQUFDLGNBQWMsR0FDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQzVDLENBQUM7UUFF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bkxtQyxZQUFZOztBQWhCbkMsa0JBQWtCO0lBRDlCLFVBQVUsRUFBRTtHQUNBLGtCQUFrQixDQW1NOUI7U0FuTVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIG1vbWVudE5zIGZyb20gJ21vbWVudCc7XG5pbXBvcnQge01vbWVudH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7V2Vla0RheXN9IGZyb20gJy4uL2NvbW1vbi90eXBlcy93ZWVrLWRheXMudHlwZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF5fSBmcm9tICcuL2RheS5tb2RlbCc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZywgSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0lNb250aENhbGVuZGFyQ29uZmlnfSBmcm9tICcuLi9tb250aC1jYWxlbmRhci9tb250aC1jYWxlbmRhci1jb25maWcnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnROcztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERheUNhbGVuZGFyU2VydmljZSB7XG4gIHJlYWRvbmx5IERFRkFVTFRfQ09ORklHOiBJRGF5Q2FsZW5kYXJDb25maWcgPSB7XG4gICAgc2hvd05lYXJNb250aERheXM6IHRydWUsXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBmYWxzZSxcbiAgICBmaXJzdERheU9mV2VlazogJ3N1JyxcbiAgICB3ZWVrRGF5Rm9ybWF0OiAnZGRkJyxcbiAgICBmb3JtYXQ6ICdERC1NTS1ZWVlZJyxcbiAgICBhbGxvd011bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBtb250aEZvcm1hdDogJ01NTSwgWVlZWScsXG4gICAgZW5hYmxlTW9udGhTZWxlY3RvcjogdHJ1ZSxcbiAgICBsb2NhbGU6IG1vbWVudC5sb2NhbGUoKSxcbiAgICBkYXlCdG5Gb3JtYXQ6ICdERCcsXG4gICAgdW5TZWxlY3RPbkNsaWNrOiB0cnVlXG4gIH07XG4gIHByaXZhdGUgcmVhZG9ubHkgREFZUyA9IFsnc3UnLCAnbW8nLCAndHUnLCAnd2UnLCAndGgnLCAnZnInLCAnc2EnXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlKSB7XG4gIH1cblxuICBnZXRDb25maWcoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWcpOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCB7XG4gICAgY29uc3QgX2NvbmZpZyA9IDxJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbD57XG4gICAgICAuLi50aGlzLkRFRkFVTFRfQ09ORklHLFxuICAgICAgLi4udGhpcy51dGlsc1NlcnZpY2UuY2xlYXJVbmRlZmluZWQoY29uZmlnKVxuICAgIH07XG5cbiAgICB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0UHJvcHNUb01vbWVudChfY29uZmlnLCBfY29uZmlnLmZvcm1hdCwgWydtaW4nLCAnbWF4J10pO1xuXG4gICAgbW9tZW50LmxvY2FsZShfY29uZmlnLmxvY2FsZSk7XG5cbiAgICByZXR1cm4gX2NvbmZpZztcbiAgfVxuXG4gIGdlbmVyYXRlRGF5c01hcChmaXJzdERheU9mV2VlazogV2Vla0RheXMpIHtcbiAgICBjb25zdCBmaXJzdERheUluZGV4ID0gdGhpcy5EQVlTLmluZGV4T2YoZmlyc3REYXlPZldlZWspO1xuICAgIGNvbnN0IGRheXNBcnIgPSB0aGlzLkRBWVMuc2xpY2UoZmlyc3REYXlJbmRleCwgNykuY29uY2F0KHRoaXMuREFZUy5zbGljZSgwLCBmaXJzdERheUluZGV4KSk7XG4gICAgcmV0dXJuIGRheXNBcnIucmVkdWNlKChtYXAsIGRheSwgaW5kZXgpID0+IHtcbiAgICAgIG1hcFtkYXldID0gaW5kZXg7XG5cbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgPHtba2V5OiBzdHJpbmddOiBudW1iZXJ9Pnt9KTtcbiAgfVxuXG4gIGdlbmVyYXRlTW9udGhBcnJheShjb25maWc6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsLCBtb250aDogTW9tZW50LCBzZWxlY3RlZDogTW9tZW50W10pOiBJRGF5W11bXSB7XG4gICAgbGV0IG1vbnRoQXJyYXk6IElEYXlbXVtdID0gW107XG4gICAgY29uc3QgZmlyc3REYXlPZldlZWtJbmRleCA9IHRoaXMuREFZUy5pbmRleE9mKGNvbmZpZy5maXJzdERheU9mV2Vlayk7XG4gICAgY29uc3QgZmlyc3REYXlPZkJvYXJkID0gbW9udGguY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xuXG4gICAgd2hpbGUgKGZpcnN0RGF5T2ZCb2FyZC5kYXkoKSAhPT0gZmlyc3REYXlPZldlZWtJbmRleCkge1xuICAgICAgZmlyc3REYXlPZkJvYXJkLnN1YnRyYWN0KDEsICdkYXknKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50ID0gZmlyc3REYXlPZkJvYXJkLmNsb25lKCk7XG4gICAgY29uc3QgcHJldk1vbnRoID0gbW9udGguY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICBjb25zdCBuZXh0TW9udGggPSBtb250aC5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcbiAgICBjb25zdCB0b2RheSA9IG1vbWVudCgpO1xuXG4gICAgY29uc3QgZGF5c09mQ2FsZW5kYXI6IElEYXlbXSA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZUFycmF5KDQyKVxuICAgICAgLnJlZHVjZSgoYXJyYXk6IElEYXlbXSkgPT4ge1xuICAgICAgICBhcnJheS5wdXNoKHtcbiAgICAgICAgICBkYXRlOiBjdXJyZW50LmNsb25lKCksXG4gICAgICAgICAgc2VsZWN0ZWQ6ICEhc2VsZWN0ZWQuZmluZChzZWxlY3RlZERheSA9PiBjdXJyZW50LmlzU2FtZShzZWxlY3RlZERheSwgJ2RheScpKSxcbiAgICAgICAgICBjdXJyZW50TW9udGg6IGN1cnJlbnQuaXNTYW1lKG1vbnRoLCAnbW9udGgnKSxcbiAgICAgICAgICBwcmV2TW9udGg6IGN1cnJlbnQuaXNTYW1lKHByZXZNb250aCwgJ21vbnRoJyksXG4gICAgICAgICAgbmV4dE1vbnRoOiBjdXJyZW50LmlzU2FtZShuZXh0TW9udGgsICdtb250aCcpLFxuICAgICAgICAgIGN1cnJlbnREYXk6IGN1cnJlbnQuaXNTYW1lKHRvZGF5LCAnZGF5JyksXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEYXRlRGlzYWJsZWQoY3VycmVudCwgY29uZmlnKVxuICAgICAgICB9KTtcbiAgICAgICAgY3VycmVudC5hZGQoMSwgJ2RheScpO1xuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH0sIFtdKTtcblxuICAgIGRheXNPZkNhbGVuZGFyLmZvckVhY2goKGRheSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHdlZWtJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyA3KTtcblxuICAgICAgaWYgKCFtb250aEFycmF5W3dlZWtJbmRleF0pIHtcbiAgICAgICAgbW9udGhBcnJheS5wdXNoKFtdKTtcbiAgICAgIH1cblxuICAgICAgbW9udGhBcnJheVt3ZWVrSW5kZXhdLnB1c2goZGF5KTtcbiAgICB9KTtcblxuICAgIGlmICghY29uZmlnLnNob3dOZWFyTW9udGhEYXlzKSB7XG4gICAgICBtb250aEFycmF5ID0gdGhpcy5yZW1vdmVOZWFyTW9udGhXZWVrcyhtb250aCwgbW9udGhBcnJheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbnRoQXJyYXk7XG4gIH1cblxuICBnZW5lcmF0ZVdlZWtkYXlzKGZpcnN0RGF5T2ZXZWVrOiBXZWVrRGF5cyk6IE1vbWVudFtdIHtcbiAgICBjb25zdCB3ZWVrZGF5TmFtZXM6IHtba2V5OiBzdHJpbmddOiBNb21lbnR9ID0ge1xuICAgICAgc3U6IG1vbWVudCgpLmRheSgwKSxcbiAgICAgIG1vOiBtb21lbnQoKS5kYXkoMSksXG4gICAgICB0dTogbW9tZW50KCkuZGF5KDIpLFxuICAgICAgd2U6IG1vbWVudCgpLmRheSgzKSxcbiAgICAgIHRoOiBtb21lbnQoKS5kYXkoNCksXG4gICAgICBmcjogbW9tZW50KCkuZGF5KDUpLFxuICAgICAgc2E6IG1vbWVudCgpLmRheSg2KVxuICAgIH07XG4gICAgY29uc3Qgd2Vla2RheXM6IE1vbWVudFtdID0gW107XG4gICAgY29uc3QgZGF5c01hcCA9IHRoaXMuZ2VuZXJhdGVEYXlzTWFwKGZpcnN0RGF5T2ZXZWVrKTtcblxuICAgIGZvciAoY29uc3QgZGF5S2V5IGluIGRheXNNYXApIHtcbiAgICAgIGlmIChkYXlzTWFwLmhhc093blByb3BlcnR5KGRheUtleSkpIHtcbiAgICAgICAgd2Vla2RheXNbZGF5c01hcFtkYXlLZXldXSA9IHdlZWtkYXlOYW1lc1tkYXlLZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB3ZWVrZGF5cztcbiAgfVxuXG4gIGlzRGF0ZURpc2FibGVkKGRhdGU6IE1vbWVudCwgY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCk6IGJvb2xlYW4ge1xuICAgIGlmIChjb25maWcuaXNEYXlEaXNhYmxlZENhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY29uZmlnLmlzRGF5RGlzYWJsZWRDYWxsYmFjayhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1pbiAmJiBkYXRlLmlzQmVmb3JlKGNvbmZpZy5taW4sICdkYXknKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhKGNvbmZpZy5tYXggJiYgZGF0ZS5pc0FmdGVyKGNvbmZpZy5tYXgsICdkYXknKSk7XG4gIH1cblxuICAvLyB0b2RvOjogYWRkIHVuaXQgdGVzdHNcbiAgZ2V0SGVhZGVyTGFiZWwoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCwgbW9udGg6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgaWYgKGNvbmZpZy5tb250aEZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIGNvbmZpZy5tb250aEZvcm1hdHRlcihtb250aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbnRoLmZvcm1hdChjb25maWcubW9udGhGb3JtYXQpO1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIHNob3VsZFNob3dMZWZ0KG1pbjogTW9tZW50LCBjdXJyZW50TW9udGhWaWV3OiBNb21lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbWluID8gbWluLmlzQmVmb3JlKGN1cnJlbnRNb250aFZpZXcsICdtb250aCcpIDogdHJ1ZTtcbiAgfVxuXG4gIC8vIHRvZG86OiBhZGQgdW5pdCB0ZXN0c1xuICBzaG91bGRTaG93UmlnaHQobWF4OiBNb21lbnQsIGN1cnJlbnRNb250aFZpZXc6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtYXggPyBtYXguaXNBZnRlcihjdXJyZW50TW9udGhWaWV3LCAnbW9udGgnKSA6IHRydWU7XG4gIH1cblxuICBnZW5lcmF0ZURheXNJbmRleE1hcChmaXJzdERheU9mV2VlazogV2Vla0RheXMpIHtcbiAgICBjb25zdCBmaXJzdERheUluZGV4ID0gdGhpcy5EQVlTLmluZGV4T2YoZmlyc3REYXlPZldlZWspO1xuICAgIGNvbnN0IGRheXNBcnIgPSB0aGlzLkRBWVMuc2xpY2UoZmlyc3REYXlJbmRleCwgNykuY29uY2F0KHRoaXMuREFZUy5zbGljZSgwLCBmaXJzdERheUluZGV4KSk7XG4gICAgcmV0dXJuIGRheXNBcnIucmVkdWNlKChtYXAsIGRheSwgaW5kZXgpID0+IHtcbiAgICAgIG1hcFtpbmRleF0gPSBkYXk7XG5cbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgPHtba2V5OiBudW1iZXJdOiBzdHJpbmd9Pnt9KTtcbiAgfVxuXG4gIGdldE1vbnRoQ2FsZW5kYXJDb25maWcoY29tcG9uZW50Q29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCk6IElNb250aENhbGVuZGFyQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY2xlYXJVbmRlZmluZWQoe1xuICAgICAgbWluOiBjb21wb25lbnRDb25maWcubWluLFxuICAgICAgbWF4OiBjb21wb25lbnRDb25maWcubWF4LFxuICAgICAgZm9ybWF0OiBjb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgaXNOYXZIZWFkZXJCdG5DbGlja2FibGU6IHRydWUsXG4gICAgICBhbGxvd011bHRpU2VsZWN0OiBmYWxzZSxcbiAgICAgIGxvY2FsZTogY29tcG9uZW50Q29uZmlnLmxvY2FsZSxcbiAgICAgIHllYXJGb3JtYXQ6IGNvbXBvbmVudENvbmZpZy55ZWFyRm9ybWF0LFxuICAgICAgeWVhckZvcm1hdHRlcjogY29tcG9uZW50Q29uZmlnLnllYXJGb3JtYXR0ZXIsXG4gICAgICBtb250aEJ0bkZvcm1hdDogY29tcG9uZW50Q29uZmlnLm1vbnRoQnRuRm9ybWF0LFxuICAgICAgbW9udGhCdG5Gb3JtYXR0ZXI6IGNvbXBvbmVudENvbmZpZy5tb250aEJ0bkZvcm1hdHRlcixcbiAgICAgIG1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjazogY29tcG9uZW50Q29uZmlnLm1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjayxcbiAgICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiBjb21wb25lbnRDb25maWcubXVsdGlwbGVZZWFyc05hdmlnYXRlQnksXG4gICAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IGNvbXBvbmVudENvbmZpZy5zaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb24sXG4gICAgICBzaG93R29Ub0N1cnJlbnQ6IGNvbXBvbmVudENvbmZpZy5zaG93R29Ub0N1cnJlbnQsXG4gICAgICBudW1PZk1vbnRoUm93czogY29tcG9uZW50Q29uZmlnLm51bU9mTW9udGhSb3dzXG4gICAgfSk7XG4gIH1cblxuICBnZXREYXlCdG5UZXh0KGNvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwsIGRheTogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAoY29uZmlnLmRheUJ0bkZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIGNvbmZpZy5kYXlCdG5Gb3JtYXR0ZXIoZGF5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF5LmZvcm1hdChjb25maWcuZGF5QnRuRm9ybWF0KTtcbiAgfVxuXG4gIGdldERheUJ0bkNzc0NsYXNzKGNvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwsIGRheTogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAoY29uZmlnLmRheUJ0bkNzc0NsYXNzQ2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBjb25maWcuZGF5QnRuQ3NzQ2xhc3NDYWxsYmFjayhkYXkpO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlTmVhck1vbnRoV2Vla3MoY3VycmVudE1vbnRoOiBNb21lbnQsIG1vbnRoQXJyYXk6IElEYXlbXVtdKTogSURheVtdW10ge1xuICAgIGlmIChtb250aEFycmF5W21vbnRoQXJyYXkubGVuZ3RoIC0gMV0uZmluZCgoZGF5KSA9PiBkYXkuZGF0ZS5pc1NhbWUoY3VycmVudE1vbnRoLCAnbW9udGgnKSkpIHtcbiAgICAgIHJldHVybiBtb250aEFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbW9udGhBcnJheS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG59XG4iXX0=