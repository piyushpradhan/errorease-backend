CREATE MIGRATION m1i5zmwr77f54qe4y2nejnimgpsbugvzpsparro5zcg3vt5l6rpa2a
    ONTO m17cotfmkl7fxataz4lpnpekooj4sfftw7x66x77srme7rh4z4u7mq
{
  ALTER TYPE default::Link {
      CREATE CONSTRAINT std::exclusive ON ((.url, .issue));
  };
};
