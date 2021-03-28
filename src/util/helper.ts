export const range= (begin: number, end: number): Array<number> => {
    let len = end - begin + 1;
    let arr = new Array(len);
    for (var i = 0; i < len; i++) {
        arr[i] = begin + i;
    }
    return arr;
}

export const convert24HTo12H = (timeIn24H: number): string => {
    const isPM = timeIn24H >= 12 && timeIn24H < 24
    let hour = timeIn24H % 12
    if (hour === 0) {
        hour = 12
    }

    return `${hour} ${isPM ? "PM" : "AM"}`
}

export const timeToDateObject = (time: number): Date => {
    const hour = Math.floor(time)
    const minutes = (time % 1) * 60

    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minutes)
    date.setSeconds(0)

    return date
}

export const dateToNumber = (date: Date): number => {
    const hour = date.getHours()
    const minutes = date.getMinutes() / 60

    return hour + minutes
}

export const getDate = (): string => {
    const date = new Date()
    return date.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' });
}