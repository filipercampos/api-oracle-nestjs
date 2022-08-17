import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export class SwaggerDoc {
  setupDocs = (app: INestApplication) => {
    const title = 'API Oracle Database';
    const description = 'API Oracle Database';
    const version = '1.0.0';
    //tags must be order manually
    //order by A-Z
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag('users', 'Users authorizated')
      .addTag('scopes', 'Authorization Scopes')
      .addTag('marvel', 'Marvel Integration')
      .addTag('health', 'Health Check')
      // .setExternalDoc('Title', 'https://websitename')

      //Not use
      // .addSecurity('access-token', {
      //   type: 'apiKey',
      //   name: 'access_token',
      //   in: 'header',
      //   scheme: 'bearer',
      //   description: 'Security Access-Token',
      // })

      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    //generate swagger json
    // fs.writeFileSync('./swagger-docs.json', JSON.stringify(document));
  };
}
