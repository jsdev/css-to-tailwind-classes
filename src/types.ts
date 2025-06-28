export interface PseudoInfo {
  classes: string[];
  elements: string[];
}

export interface ConversionResult {
  selector: string;
  baseSelector: string;
  pseudoInfo: PseudoInfo;
  tailwindClasses: string[];
  warnings?: string[];
  unconvertible: Array<{
    property: string;
    value: string;
    reason: string;
  }>;
}

export interface CSSRule {
  selector: string;
  baseSelector: string;
  pseudoInfo: PseudoInfo;
  declarations: Array<{
    property: string;
    value: string;
  }>;
}

export type TailwindMap = Record<string, string | ((value: string) => string[])>;