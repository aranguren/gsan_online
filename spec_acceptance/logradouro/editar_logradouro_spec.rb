require "rails_helper"

describe "Como cadastrista", type: :feature, js: true do
  it "eu posso editar um logradouro" do
    visit root_path

    click_link "Logradouros"
    fill_in "logradouro_nome", with: "cear"
    click_button "Pesquisar"

    find(".logradouro:last-child").click_link "Editar"

    select "AV", from: "logradouro_tipo_id"
    select "ALM", from: "titulo_logradouro_id"
    fill_in "logradouro_nome",          with: "ANTONIO BARRETO"
    fill_in "logradouro_nome_popular",  with: "BARRETAO"
    select_from_autocomplete("rio", "RIO BRANCO | ACRE", "municipios")

    uncheck "logradouro_ativo"

    testar_bairros
    testar_ceps

    select "CONQUISTA", from: "bairros"

    within "#pesquisa_cep" do
      fill_in "codigo_cep", with: "66050380"
      click_button "Adicionar"
    end
    expect(page).to have_css "#cep_66050380", count: 1

    click_button "Salvar Logradouro"

    validar
  end

  def validar
    expect(page).to have_content "Logradouro editado com sucesso"

    fill_in "logradouro_nome", with: "anto"
    select_from_autocomplete("rio", "RIO BRANCO | ACRE", "bairro_municipio_id")

    click_button "Pesquisar"

    expect(page).to have_content "ANTONIO BARRETO"
    #expect(page).to have_content "BARRETAO"
    expect(page).to have_css ".logradouro_ativo", text: ""
  end

  def testar_ceps
    within "#pesquisa_cep" do
      fill_in "codigo_cep", with: "12341234"
      click_button "Adicionar"
      expect(page).to have_content "CEP não encontrado"
    end
    expect(page).to have_css "#cep_12341234", count:  0

    within "#pesquisa_cep" do
      fill_in "codigo_cep", with: "66050380"
      click_button "Adicionar"
    end

    expect(page).to have_css "#cep_66050380", count: 1

    within "#pesquisa_cep" do
      fill_in "codigo_cep", with: "66050380"
      click_button "Adicionar"
      expect(page).to have_content "CEP já selecionado"
    end
    expect(page).to have_css "#cep_66050380", count: 1

    within "#cep_66050380" do
      click_link "X"
    end
    expect(page).to have_css "#cep_66050380", count: 0
  end

  def testar_bairros
      select "CONQUISTA", from: "bairros"
      expect(page).to have_css ".bairro", text: "CONQUISTA", count: 1
      select "CALADIM", from: "bairros"
      expect(page).to have_css ".bairro", text: "CALADIM", count: 1
      select "CONQUISTA", from: "bairros"
      expect(page).to have_css ".bairro", text: "CONQUISTA", count: 1
      expect(page).to have_content "Bairro já selecionado"

      within ".bairro[data-logradouro-bairro-nome='CONQUISTA']" do
        click_link "X"
      end
      expect(page).to have_css ".bairro", text: "CONQUISTA", count: 0

      within ".bairro[data-logradouro-bairro-nome='CALADIM']" do
        click_link "X"
      end
      expect(page).to have_css ".bairro", text: "CALADIM", count: 0
  end
end