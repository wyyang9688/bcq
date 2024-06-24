type AllNonNullable<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

export function notNull<T>(obj: T): obj is AllNonNullable<T> {
    return Object.values(obj as ArrayLike<T>).every(
        (value) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            (!Array.isArray(value) || value.length > 0)
    );
}
const hn = (num: number = 0) => {
    let no = Number(Number(parseFloat(num + "") * 1000).toFixed(1));
    return no >= 1000 ? Number(no / 1000).toFixed(1) + "k" : no;
};
const getOncePageParams = (key: string) : any => {
    const data = uni.getStorageSync(key);
    if (data) uni.removeStorageSync(key);
    return data;
};

export default {
    notNull,
    hn,
    getOncePageParams
};
