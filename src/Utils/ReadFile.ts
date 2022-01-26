export function ReadTextFile(file: string)
{
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}