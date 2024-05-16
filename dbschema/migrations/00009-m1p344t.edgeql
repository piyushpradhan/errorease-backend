CREATE MIGRATION m1p344tcimjvozbmaxgng4ejfeqkmkzvdgenk27nwnnq4aby43nynq
    ONTO m1vc7cgofoqkjvq2cbq7vf56bwxyo3jk3lhpfdk2gnhqqgeppiqnea
{
  ALTER TYPE default::Issue {
      ALTER LINK labels {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET OPTIONALITY;
          SET TYPE default::Label;
      };
      ALTER LINK links {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET OPTIONALITY;
          SET TYPE default::Link;
      };
      ALTER PROPERTY status {
          SET default := 'Open';
      };
  };
  ALTER TYPE default::Label {
      ALTER LINK issue {
          RENAME TO issues;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK issues {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET OPTIONALITY;
          SET TYPE default::Issue;
      };
      ALTER LINK labels {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET OPTIONALITY;
          SET TYPE default::Label;
      };
  };
};
