import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
const moment = momentNs;
const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;
let DayTimeCalendarService = class DayTimeCalendarService {
    constructor(utilsService, dayCalendarService, timeSelectService) {
        this.utilsService = utilsService;
        this.dayCalendarService = dayCalendarService;
        this.timeSelectService = timeSelectService;
        this.DEFAULT_CONFIG = {
            locale: moment.locale()
        };
    }
    getConfig(config) {
        const _config = Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.timeSelectService.getConfig(config)), this.dayCalendarService.getConfig(config));
        moment.locale(config.locale);
        return _config;
    }
    updateDay(current, day, config) {
        const time = current ? current : moment();
        let updated = moment(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
        if (config.min) {
            const min = config.min;
            updated = min.isAfter(updated) ? min : updated;
        }
        if (config.max) {
            const max = config.max;
            updated = max.isBefore(updated) ? max : updated;
        }
        return updated;
    }
    updateTime(current, time) {
        const day = current ? current : moment();
        return moment(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
    }
};
DayTimeCalendarService.ctorParameters = () => [
    { type: UtilsService },
    { type: DayCalendarService },
    { type: TimeSelectService }
];
DayTimeCalendarService = __decorate([
    Injectable()
], DayTimeCalendarService);
export { DayTimeCalendarService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFHbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUV4QixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDOUIsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBQy9CLE1BQU0sZUFBZSxHQUFHLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFHakQsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFLakMsWUFBb0IsWUFBMEIsRUFDMUIsa0JBQXNDLEVBQ3RDLGlCQUFvQztRQUZwQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFOL0MsbUJBQWMsR0FBMkI7WUFDaEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7U0FDeEIsQ0FBQztJQUtGLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBOEI7UUFDdEMsTUFBTSxPQUFPLGlEQUNSLElBQUksQ0FBQyxjQUFjLEdBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQ3hDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQzdDLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQWUsRUFBRSxHQUFXLEVBQUUsTUFBOEI7UUFDcEUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFekYsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxHQUFHLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUMvQixPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDaEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLEdBQUcsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQy9CLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUNqRDtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZSxFQUFFLElBQVk7UUFDdEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXpDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQ0YsQ0FBQTs7WUF2Q21DLFlBQVk7WUFDTixrQkFBa0I7WUFDbkIsaUJBQWlCOztBQVA3QyxzQkFBc0I7SUFEbEMsVUFBVSxFQUFFO0dBQ0Esc0JBQXNCLENBNENsQztTQTVDWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtEYXlDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge1RpbWVTZWxlY3RTZXJ2aWNlfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5zZXJ2aWNlJztcbmltcG9ydCB7SURheVRpbWVDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi9kYXktdGltZS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnROcztcblxuY29uc3QgREFZX0ZPUk1BVCA9ICdZWVlZTU1ERCc7XG5jb25zdCBUSU1FX0ZPUk1BVCA9ICdISDptbTpzcyc7XG5jb25zdCBDT01CSU5FRF9GT1JNQVQgPSBEQVlfRk9STUFUICsgVElNRV9GT1JNQVQ7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlIHtcbiAgcmVhZG9ubHkgREVGQVVMVF9DT05GSUc6IElEYXlUaW1lQ2FsZW5kYXJDb25maWcgPSB7XG4gICAgbG9jYWxlOiBtb21lbnQubG9jYWxlKClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGRheUNhbGVuZGFyU2VydmljZTogRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHRpbWVTZWxlY3RTZXJ2aWNlOiBUaW1lU2VsZWN0U2VydmljZSkge1xuICB9XG5cbiAgZ2V0Q29uZmlnKGNvbmZpZzogSURheVRpbWVDYWxlbmRhckNvbmZpZyk6IElEYXlUaW1lQ2FsZW5kYXJDb25maWcge1xuICAgIGNvbnN0IF9jb25maWcgPSB7XG4gICAgICAuLi50aGlzLkRFRkFVTFRfQ09ORklHLFxuICAgICAgLi4udGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRDb25maWcoY29uZmlnKSxcbiAgICAgIC4uLnRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcpXG4gICAgfTtcblxuICAgIG1vbWVudC5sb2NhbGUoY29uZmlnLmxvY2FsZSk7XG5cbiAgICByZXR1cm4gX2NvbmZpZztcbiAgfVxuXG4gIHVwZGF0ZURheShjdXJyZW50OiBNb21lbnQsIGRheTogTW9tZW50LCBjb25maWc6IElEYXlUaW1lQ2FsZW5kYXJDb25maWcpOiBNb21lbnQge1xuICAgIGNvbnN0IHRpbWUgPSBjdXJyZW50ID8gY3VycmVudCA6IG1vbWVudCgpO1xuICAgIGxldCB1cGRhdGVkID0gbW9tZW50KGRheS5mb3JtYXQoREFZX0ZPUk1BVCkgKyB0aW1lLmZvcm1hdChUSU1FX0ZPUk1BVCksIENPTUJJTkVEX0ZPUk1BVCk7XG5cbiAgICBpZiAoY29uZmlnLm1pbikge1xuICAgICAgY29uc3QgbWluID0gPE1vbWVudD5jb25maWcubWluO1xuICAgICAgdXBkYXRlZCA9IG1pbi5pc0FmdGVyKHVwZGF0ZWQpID8gbWluIDogdXBkYXRlZDtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1heCkge1xuICAgICAgY29uc3QgbWF4ID0gPE1vbWVudD5jb25maWcubWF4O1xuICAgICAgdXBkYXRlZCA9IG1heC5pc0JlZm9yZSh1cGRhdGVkKSA/IG1heCA6IHVwZGF0ZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG4gIH1cblxuICB1cGRhdGVUaW1lKGN1cnJlbnQ6IE1vbWVudCwgdGltZTogTW9tZW50KTogTW9tZW50IHtcbiAgICBjb25zdCBkYXkgPSBjdXJyZW50ID8gY3VycmVudCA6IG1vbWVudCgpO1xuXG4gICAgcmV0dXJuIG1vbWVudChkYXkuZm9ybWF0KERBWV9GT1JNQVQpICsgdGltZS5mb3JtYXQoVElNRV9GT1JNQVQpLCBDT01CSU5FRF9GT1JNQVQpO1xuICB9XG59XG4iXX0=