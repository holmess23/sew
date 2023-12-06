import xml.etree.ElementTree as ET


def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo 
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n") 

def getCoordenadas(archivoXML, num):
    expresionXPath = "{http://tempuri.org/rutas}ruta["+ str(num+1) +"]/{http://tempuri.org/rutas}hitos/{http://tempuri.org/rutas}hito/{http://tempuri.org/rutas}coordenadas"
    linea = [0,0,0]
    try:
        
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    raiz = arbol.getroot()
    i = 0
    # Recorrido de los elementos del árbol
    for hijo in raiz.findall(expresionXPath): 
        linea[i] = hijo.text
        i +=1
    return linea
    
    
def main():
    miArchivoXML = input('Introduzca un archivo XML = ')
        
    for i in range(3):
        nombreSalida  = "ruta" + str(i+1)
        try:
            salida = open(nombreSalida + ".kml",'w')
        except IOError:
            print ('No se puede crear el archivo ', nombreSalida + ".kml")
            exit()
        prologoKML(salida, nombreSalida)
       
        linea = getCoordenadas(miArchivoXML, i)
        if not linea: break
        for l in linea:
            salida.write(l+"\n")
        epilogoKML(salida)
        salida.close()

if __name__ == "__main__":
    main()