import xml.etree.ElementTree as ET
import svgwrite

def generar_svg(nombre_svg, distancias, altimetrias):
    dwg = svgwrite.Drawing(nombre_svg+".svg", profile='tiny')

    puntos = [(j , i) for i, j in zip(altimetrias[::-1], distancias)]
    for k in puntos:
        print(k)
    dwg.add(dwg.polyline(points=puntos, fill='none', stroke=svgwrite.rgb(255, 0, 0, '%')))
    dwg.save()
    
def getAltimetrias(archivoXML, num):
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
    print('altimetrias')
    for hijo in raiz.findall(expresionXPath): 
        coord = hijo.text.split(",")
        linea[i] = float(coord[2])
        if linea[i] > 2000:
            linea[i] = 0;
        print(linea[i])
        i +=1
    return linea


def getDistancias(archivoXML, num):
    expresionXPath = "{http://tempuri.org/rutas}ruta["+ str(num + 1) +"]/{http://tempuri.org/rutas}hitos/{http://tempuri.org/rutas}hito/{http://tempuri.org/rutas}distancia"
    linea = [0,0,0]
    distancia = 0
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
    print('distancias')
    for hijo in raiz.findall(expresionXPath):
        distancia += float(hijo.text)
        linea[i] = distancia
        print(linea[i])
        i +=1
    return linea

def main():
    archivo_xml = 'rutasEsquema.xml'
    
    for i in range(3):
        nombre_svg  = "perfil" + str(i+1)
        print(i)
        distancias = getDistancias(archivo_xml,i)
        altimetrias = getAltimetrias(archivo_xml,i)

        generar_svg(nombre_svg, distancias, altimetrias)

if __name__ == '__main__':
    main()
