/**
  * Strong-typed version of [Random](https://github.com/vincentvictoria/random)
  *
  * @author cupglassdev
  * @originalAuthor vincentvictoria
  * @see https://github.com/cupglassdev/random
  */

/** Upper Alphabets */
export const upperAlphabets:"ABCDEFGHIJKLMNOPQRSTUVWXTYZ" = "ABCDEFGHIJKLMNOPQRSTUVWXTYZ";

/** Lower Alphabets */
export const lowerAlphabets:"abcdefghijklmnopqrstuvwxtyz = "abcdefghijklmnopqrstuvwxtyz";

/** Alphabets */
export const alphabets:`${typeof lowerAlphabets}${typeof upperAlphabets}` = `${lowerAlphabets}${upperAlphabets}`;

/** Numbers */
export const numbers:"0123456789" = "0123456789";

/** Alpha Numerics */
export const alphaNumerics:`${typeof alphabets}${typeof numbers}` = `${alphabets}${numbers}`;

/** Upper Alpha Numerics */
export const upperAlphaNumerics:`${typeof upperAlphabets}${typeof numbers}` = `${upperAlphabets}${numbers}`;

/** Lower Alpha Numerics */
export const lowerAlphaNumerics:`${typeof lowerAlphabets}${typeof numbers}` = `${lowerAlphabets}${numbers}`;

/** The reversed POSITION (not reversed characters) for Alpha Numerics */
export const reversedPosition:{
alphaNumerics:`${typeof numbers}${typeof alphabets}`,
upperAlphaNumberics:`${typeof numbers}${typeof upperAlphabets}`,
lowerAlphaNumberics:`${typeof numbers}${typeof lowerAlphabets}`
} = {
    
/** Reversed Alpha Numerics */
alphaNumerics:`${numbers}${alphabets}` as const,
    
/** Reversed Upper Alpha Numerics */
upperAlphaNumberics:`${numbers}${upperAlphabets}` as const,
    
/** Reversed Lower Alpha Numerics */
lowerAlphaNumberics:`${numbers}${lowerAlphabets}` as const
 
}

/** Random class */
export class Random {
    
    /** The random generator. Defaults to {@link Math.random} */
    public readonly generator:()=>number=Math.random;
    
    /**
      * Random constructor class
      *
      * @param generator The random generator. If unset, defaults to {@link Math.random}
      */
    constructor( generator?:()=>number ) {
        if (generator) this.generator = generator
    }
    
    /** check if min was bigger. If it does, throw an error */
    private checkIfMinBigger(min:number, max:number):void{
        if (min>max) throw new ReferenceError(`Random error: Minimum (${min}) is bigger than Maximum (${max})`)
    }
    
    /** 
      * Get random interger 
      * 
      * @param min Minimum number (inclusive)
      * @param max Maximum number (exclusive)
      */
    interger( min:number=0, max:number=1 ):number {
        this.checkIfMinBigger(min, max)
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.generator() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    /** 
      * Get random real number 
      * 
      * @param min Minimum number (inclusive)
      * @param max Maximum number (exclusive)
      */
    real( min:number=0, max:number=1 ):number {
        this.checkIfMinBigger(min, max)
        return this.generator() * (max - min) + min;
    }
    
    /** 
      * Mix characters using randomness
      * 
      * @param len The length of the returned string
      * @param src The string source to mix
      */
    string(len:number, src:string = lowerAlphaNumerics ):string {
        let s = "";
        for ( let lp1 = 0; lp1 < len; lp1++ ) s += src.charAt( this.interger( 0, src.length-1 ) );
        return s;
    }

    /**
     * Mix characters using randomness, by either using {@link alphabets} or {@link alphaNumerics}
     *
     * @param len The length of the returned name
     */
    variable( len:number ):string {
        let s = "";
        if ( len > 0 ) s += alphabets[ this.interger( 0, alphabets.length-1 ) ];
        for ( let lp1 = 1; lp1 < len; lp1++ )
            s += alphaNumerics[ this.interger( 0, alphaNumerics.length-1 ) ];
        return s;
    }
    
    /** 
      * Pick any element from args. For less strict, use {@link pick}
      *
      * But, use {@link strictPickArray} if you want to do an array instead
      * 
      * @param args The arguments
      */
    strictPick<T extends [unknown, unknown, ...unknown[]]>( ...args:T ):T[number] {
        if (args.length<2) throw new ReferenceError("Random error: `strictPick` at least needs two elements from the array");
        return args[ this.interger( 0, args.length-1 ) ];
    }
    
    /** 
      * Pick any element from args. For the strict version, use {@link strictPick}
      *
      * But, use {@link pickArray} if you want to do an array instead
      * 
      * @param args The arguments
      */
    pick<T extends unknown[]>( ...args:T ):T[number]|undefined {
        if (args.length<2) return;
        return args[ this.interger( 0, args.length-1 ) ];
    }
    
    /**
      * Pick element from the array. For less strict, use {@link pickArray} instead
      *
      * @param arr The array
      */
    strictPickArray<T extends [unknown, unknown, unknown[]]>( arr:T ):T[number] {
      if (arr.length<2) throw new ReferenceError("Random error: `strictPick` at least needs two elements from the array");
        return arr[ this.interger( 0, arr.length-1 ) ];
    }
    
    /**
      * Try pick any element from the array. The type is less strict than {@link strictPickArray}
      *
      * @param arr The array
      */
    pickArray<T extends unknown[]>( arr:T ):T[number]|undefined {
        if (arr.length<2) return;
        return arr[ this.interger( 0, arr.length-1 ) ];
    }

    /**
     * Randomly select numbers from array, but the probability is proportional to the corresponding number
     * 
     * For the strict version, use {@link strictWeightedArray}
     * 
     * @param arr The arguments
     */
    weightedArray<T extends number[]>( arr:number[] ):T[number]|undefined {
      const totalWeight = arr.reduce((acc, weight) => acc + weight, 0);

      if (totalWeight === 0) return;
    
      const randomValue = this.generator() * totalWeight;
      let cumulativeWeight = 0;
    
      for (let i = 0; i < arr.length; i++) {
        cumulativeWeight += arr[i];
        if (randomValue < cumulativeWeight) {
          return i;
        }
      }
    
      // If the loop completes without finding a suitable index,
      // it means there might be a rounding error or a very small weight.
      // In this case, we can return the last index.
      return arr[arr.length - 1];
    }
    /** 
     * The strict version of {@link weightedArray} 
     * 
     * @param arr The array
     */
    strictWeightedArray<T extends number[]>(arr:number[]):T[number]{
      const res = this.weightedArray<T>(arr)
      if (!res) throw new ReferenceError("Random error: Total weight cannot be zero");
      return res
    }
    /** 
     * Randomly select numbers from arguments, but the probability is proportional to the corresponding number
     * 
     * For the strict version, use {@link strictWeighted}
     * 
     * @param args The arguments
     */
    weighted<T extends number[]>(...args:number[]):T[number]|undefined{
      return this.weightedArray<T>(args)
    }
    /** 
     * The strict version of {@link weighted} 
     * 
     * @param args The arguments
     */
    strictWeighted<T extends number[]>(...args:number[]):T[number]{
      const res = this.weightedArray<T>(args)
      if (!res) throw new ReferenceError("Random error: Total weight cannot be zero");
      return res
    }
}

/**
  * Strong-typed version of [Random](https://github.com/vincentvictoria/random)
  *
  * @author cupglassdev
  * @originalAuthor vincentvictoria
  * @see https://github.com/cupglassdev/random
  */
export default {
    upperAlphabets,
    lowerAlphabets,
    alphabets,
    numbers,
    alphaNumerics,
    upperAlphaNumerics,
    lowerAlphaNumerics,
    reversedPosition,
    Random
}
