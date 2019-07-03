/** Finger positions. */
export enum FingerPosition {
    Unknown         = 0,
    RightThumb      = 1,
    RightIndex      = 2,
    RightMiddle     = 3,
    RightRing       = 4,
    RightLittle     = 5,
    LeftThumb       = 6,
    LeftIndex       = 7,
    LeftMiddle      = 8,
    LeftRing        = 9,
    LeftLittle      = 10,
}

/** A finger enrollment data. */
export class Finger
{
    constructor(
        /** A finger position. */
        public readonly position: FingerPosition,
    ){}

    /** Creates a finger enrollment data object from a plain JSON object. */
    public static fromJson(json: object)
    {
        const obj = json as Finger;
        return new Finger(obj.position);
    }
}

/** A collection of finger enrollment data. */
export type Fingers = Finger[];
