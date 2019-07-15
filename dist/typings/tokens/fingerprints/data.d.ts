/** Finger positions. */
export declare enum FingerPosition {
    Unknown = 0,
    RightThumb = 1,
    RightIndex = 2,
    RightMiddle = 3,
    RightRing = 4,
    RightLittle = 5,
    LeftThumb = 6,
    LeftIndex = 7,
    LeftMiddle = 8,
    LeftRing = 9,
    LeftLittle = 10
}
/** A finger enrollment data. */
export declare class Finger {
    /** A finger position. */
    readonly position: FingerPosition;
    constructor(
    /** A finger position. */
    position: FingerPosition);
    /** Creates a finger enrollment data object from a plain JSON object. */
    static fromJson(json: object): Finger;
}
/** A collection of finger enrollment data. */
export declare type Fingers = Finger[];
