# CLI-Pago-mis-impuestos

Este proyecto es una herramienta de linea de comandos (_CLI_) desarrollada en **Node.js** que automatiza el proceso de verificación y pago de facturas pendientes de las siguientes empresas[[1]](#enterprises) y no pretende hacer competencia directa con las mismas, sino, facilitar el uso de estas.

En el caso de que la misma empresa proporcione una API, de ser posible se usara esta misma.

## Tabla de contenidos

- [¿Como funciona?](#how-it-works)
- [¿Como puedo colaborar?](#colaborate)
- [Empresas que soportamos](#enterprises)
- [Seguridad](#security)
- [Licencia](#licence)

### ¿Como funciona?

Funciona como el débito automatico, en el sentido que dejas que el script te guarde tus cuentas en un archivo cifrado en **tu computadora**, elijes que servicios son los que usas y guardas información de usuario de estos mismos, ademas de metodos de pago. \
Usando tus datos se inicia sesión en los respectivos servicios que uses y verifica si;

1. Existe algún impuesto por pagar o si ya esta pago.
2. Mantiene la sesión para poder ver la ultima factura.
3. Pagar individualmente o pagar todas al mismo tiempo.

### ¿Como puedo colaborar?

Si no eres programador puedes ponerte en contacto con el [autor](mailto:dapadev[at]hotmail[dot]com) del proyecto por correo o tambien puedes escribir tu propuesta creando una [_Issue_](https://github.com/dapabe/cli-pago-mis-impuestos/issues) en este repositorio. \
Si quieres hacer un aporte desarrollando necesitas:

- [node v^20.10.0](#https://nodejs.org/en/download/package-manager)
- [pnpm v^9.4.0](#https://pnpm.io/installation)

Y ejecutar lo siguiente:

```bash
 pnpm install
 pnpm start
```

O tambien, pero mas lento:

```bash
npm install
npx tsx src/index.ts
```

### Seguridad

Este proyecto toma la seguridad muy en serio. Las credenciales y otros datos sensibles se almacenan en un archivo cifrado localmente en tu computadora. Asegúrate de mantener este archivo seguro y no compartirlo con nadie.

### <enterprises> [[1]](#enterprises) Actualmente se soporta:

- Aysa - [Leer términos y condiciones](#https://www.aysa.com.ar/Terminos_y_condiciones)
- Edesur - [Leer términos y condiciones](#https://www.edesur.com.ar/acerca-de-edesur/proveedores/)
- Telecentro - [Leer términos y condiciones](#https://telecentro.com.ar/terminos)

### Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo [LICENSE](./LICENSE.txt) para más detalles.
