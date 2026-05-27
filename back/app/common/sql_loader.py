import xml.etree.ElementTree as ET

class SQLLoader:
    _sql_cache = {}

    @classmethod
    def load_sql(cls, xml_file_path: str, namespace: str, sql_id: str) -> str:
        if (xml_file_path, namespace, sql_id) in cls._sql_cache:
            return cls._sql_cache[(xml_file_path, namespace, sql_id)]

        tree = ET.parse(xml_file_path)
        root = tree.getroot()

        # mapper가 루트인 경우와 자식인 경우 모두 처리
        mappers = [root] if root.tag == 'mapper' else root.findall('mapper')

        for mapper in mappers:
            if mapper.get('namespace') == namespace:
                for tag in ('select', 'insert', 'update', 'delete'):
                    for elem in mapper.findall(tag):
                        if elem.get('id') == sql_id:
                            sql = elem.text.strip()
                            cls._sql_cache[(xml_file_path, namespace, sql_id)] = sql
                            return sql
        raise ValueError(f"SQL with id '{sql_id}' not found in namespace '{namespace}' in file '{xml_file_path}'")
