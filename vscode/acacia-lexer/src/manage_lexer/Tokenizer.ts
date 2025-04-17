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
    Semicolon = 59,
    Quote = 39,
    QuoteDouble = 34,
    Comma = 44,
    Period = 46,
    Slash = 47
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
export enum TokensClass {
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
    Asterisk,
    Slash,
    LeftParenthesis,
    RightParenthesis,
    OtherCharacter
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
        this.tokens = [];
        this.token = {};
        while ((code = await this.fileUtils.decodeUtf8()) !== undefined) {
            this.token[this.tokens.length] = [code];
            if (code >= Digits.Z && code <= Digits.N) {
                this.tokens.push(TokensClass.Number);
            } else if (code >= UpperCase.A && code <= UpperCase.Z) {
                this.tokens.push(TokensClass.Word);
            }
            else if (code >= LowerCase.a && code <= LowerCase.z) {
                this.tokens.push(TokensClass.word);
            }
            else if (code === OtherCharacters.NewLine || code === OtherCharacters.CarriageReturn) {
                this.tokens.push(TokensClass.EoL);
            }
            else if (code === OtherCharacters.Space || code === OtherCharacters.Tab) {
                this.tokens.push(TokensClass.Separator);
            }
            else if (code === SpecialCharacters.Underscore) {
                this.tokens.push(TokensClass.Underscore);
            }
            else if (code === SpecialCharacters.Hyphen) {
                this.tokens.push(TokensClass.Hyphen);
            }
            else if (code === OtherCharacters6.LeftCurlyBrace) {
                this.tokens.push(TokensClass.LeftCurlyBrace);
            }
            else if (code === OtherCharacters6.RightCurlyBrace) {
                this.tokens.push(TokensClass.RightCurlyBrace);
            }
            else if (code === SpecialCharacters.Asterisk) {
                this.tokens.push(TokensClass.Asterisk);
            }
            else if (code === SpecialCharacters.Slash) {
                this.tokens.push(TokensClass.Slash);
            }
            else if (code === OtherCharacters6.LeftParenthesis) {
                this.tokens.push(TokensClass.LeftParenthesis);
            }
            else if (code === OtherCharacters6.RightParenthesis) {
                this.tokens.push(TokensClass.RightParenthesis);
            } else {
                this.tokens.push(TokensClass.OtherCharacter);
            }


        }
        this.fileUtils.closeReader();
}

public walkTokens(): void {
    let i = 0;
    let j = 0;
    while (i < this.tokens.length) {
        if (this.tokens[i] === TokensClass.Number) {
            j = i+1;
            while (this.tokens[j] === TokensClass.Number) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        } else if (this.tokens[i] === TokensClass.Word) {
            j = i+1;
            while (this.tokens[j] === TokensClass.Word  && this.tokens[j+1] !== TokensClass.word) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            while (this.tokens[j] === TokensClass.word) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        } else if (this.tokens[i] === TokensClass.word) {
            j = i+1;
            while (this.tokens[j] === TokensClass.word) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        }
        else if (this.tokens[i] === TokensClass.EoL) {
            j = i+1;
            while (this.tokens[j] === TokensClass.EoL) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        }
        else if (this.tokens[i] === TokensClass.Separator) {
            j = i+1;
            while (this.tokens[j] === TokensClass.Separator) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        }
        else if (this.tokens[i] === TokensClass.Underscore) {
            j = i+1;
            while (this.tokens[j] === TokensClass.Underscore) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        }
        else if (this.tokens[i] === TokensClass.Slash && this.tokens[i+1] === TokensClass.Slash) {
            this.tokens[i] = TokensClass.CommentSingle;
            this.token[i].push(this.token[i+1][0]);
            i = i+2;
            continue;
        }
        else if (this.tokens[i] === TokensClass.Slash && this.tokens[i+1] === TokensClass.Asterisk) {
            this.tokens[i] = TokensClass.CommentMultiStart;
            this.token[i].push(this.token[i+1][0]);
            i = i+2;
            continue;
        } else if (this.tokens[i] === TokensClass.Asterisk && this.tokens[i+1] === TokensClass.Slash) {
            this.tokens[i] = TokensClass.CommentMultiEnd;
            this.token[i].push(this.token[i+1][0]);
            i = i+2;
            continue;
        }
        else if (this.tokens[i] === TokensClass.OtherCharacter) {
            j = i+1;
            while (this.tokens[j] === TokensClass.OtherCharacter) {
                this.token[i].push(this.token[j][0]);
                j++;
            }
            i = j;
            continue;
        }

        i++;
    }
}


}
