
CREATE or replace FUNCTION cria_instrutor_trigger() RETURNS trigger AS $$ 
    DECLARE
        media_salarial DECIMAL;
        instrutor_recebe_menos INTEGER DEFAULT 0;
        total_instrutores INTEGER DEFAULT 0;
        salario DECIMAL;
        percentual DECIMAL(5,2);
    BEGIN
        SELECT AVG(instrutor.salario) INTO media_salarial FROM instrutor WHERE id != NEW.id;

        IF NEW.salario > media_salarial THEN
            INSERT INTO log_instrutores (informacao) VALUES (NEW.nome || ' recebe acima da média');
        END IF;

        FOR salario IN SELECT instrutor.salario FROM instrutor WHERE id != NEW.id LOOP
            total_instrutores := total_instrutores + 1;

            IF NEW.salario > salario THEN
                instrutor_recebe_menos := instrutor_recebe_menos + 1;
            END IF;    
        END LOOP;

        percentual = instrutor_recebe_menos::DECIMAL / total_instrutores::DECIMAL * 100;

        INSERT INTO log_instrutores (informacao) 
            VALUES (NEW.nome || ' recebe mais do que ' || percentual || '% da grade de instrutores');
		
		Return new;
	
    END;
$$ LANGUAGE plpgsql;

