import { FileUtils } from '../utils/FileUtils';

export enum Digits {
    Z = 48,
    N = 57,
}

export enum UpperCase {
    A = 65,
    Z = 90,
}

export enum LowerCase {
    a = 97,
    z = 122,
}

export enum SpecialCharacters {
    Underscore = 95,
    Hyphen = 45,
    Exclamation = 33,
    At = 64,
    Hash = 35,
    Dollar = 36,
    Percent = 37,
    Caret = 94,
    Ampersand = 38,
    Asterisk = 42,
    ParenthesisLeft = 40,
    ParenthesisRight = 41,
    Minus = 45,
    Plus = 43,
    Equals = 61,
    BracketLeft = 91,
    BracketRight = 93,
    BraceLeft = 123,
    BraceRight = 125,
}
export enum OtherCharacters {
    Space = 32,
    Tab = 9,
    NewLine = 10,
    CarriageReturn = 13,
}
export enum OtherCharacters2 {
    BackSlash = 92,
    ForwardSlash = 47,
    Colon = 58,
    Semicolon = 59,
    Quote = 34,
    Comma = 44,
    Period = 46,
}
export enum OtherCharacters3 {
    Tilde = 126,
    GraveAccent = 96,
    Pipe = 124,
    QuestionMark = 63,
}
export enum OtherCharacters4 {
    BackTick = 96,
    LessThan = 60,
    GreaterThan = 62,
}
export enum OtherCharacters5 {
    ExclamationMark = 33,
    Ampersand = 38,
    PercentSign = 37,
    Caret = 94,
    PlusSign = 43,
    EqualSign = 61,
    Underscore = 95,
}
export enum OtherCharacters6 {
    LeftCurlyBrace = 123,
    RightCurlyBrace = 125,
    LeftSquareBracket = 91,
    RightSquareBracket = 93,
    LeftParenthesis = 40,
    RightParenthesis = 41,
}
export enum OtherCharacters7 {
    LeftAngleBracket = 60,
    RightAngleBracket = 62,
    VerticalBar = 124,
    Backslash = 92,
    ForwardSlash = 47,
}
export enum OtherCharacters8 {
    Colon = 58,
    Semicolon = 59,
    Quote = 34,
    Comma = 44,
    Period = 46,
}
export enum OtherCharacters9 {
    QuestionMark = 63,
    ExclamationMark = 33,
    Tilde = 126,
    GraveAccent = 96,
}
export enum Tokens {
    Number,
    Word,
    word,
    CommentMultiStart,
    CommentMultiEnd,
    CommentSingle,
    EoL,
    Separator,
    Underscore,
    Hyphen,
    LeftCurlyBrace,
    RightCurlyBrace,
    OtherCharacter
}
enum States {
    Start,
    InWord,
    InNumber,
    Inword,
    InSlash,
    InAsterisk,
    InUnderscore
}

export class Tokenizer {

  public token: {[key: number]: number[]} = {};
  public tokens: number[] = [];

  public fileUtils: FileUtils;
  public constructor(fileUtils: FileUtils) {
    this.fileUtils = fileUtils;
  }


    public async tokenize(): Promise<void> {
        this.fileUtils.initializeChunkReader(1028);
        let code: number | undefined = 0;
        let state: States = States.Start;
        let token: number[] = [];
        while ((code = await this.fileUtils.decodeUtf8()) !== undefined) {


        }
        this.fileUtils.closeReader();
}


}
