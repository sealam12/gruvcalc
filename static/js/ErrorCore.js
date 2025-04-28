export class FatalError extends Error {  
    constructor(Message, Stack) {  
        super(Message);  
        this.Name = "FatalError";
  
        Error.captureStackTrace(this, FatalError);  
  
        // Capture the stack trace to extract file names and line numbers    
        const StackLines = Stack ? Stack.split("\n").slice(1) : this.stack.split("\n").slice(1);    
        let ErrorDetails = StackLines.map((Line, Index) => {  
            // Use a regular expression to extract the file name and line number    
            const Match = Line.match(/at (.+):(\d+):(\d+)/);  
            if (Match) {  
                return `Line ${Match[2]} in ${Match[1]}`;  
            }  
            return `Unknown line in ${Line}`;  
        }).join("<br>"); // Join all error details with line breaks  
  
        let NewHTML =  `<center>  
            <div class="box-unsized">  
                <p>A fatal error has occurred.</p>  
                <div class="item error" style="margin: 0px;">${Message}<br>${ErrorDetails}</div>  
            </div>  
        </center>`;  
        document.body.innerHTML = NewHTML;  
    }  
}

window.FatalError = FatalError;